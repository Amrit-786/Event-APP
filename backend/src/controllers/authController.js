const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('../utils/mailer');

function getGoogleClientId() {
  return (process.env.GOOGLE_CLIENT_ID || '').trim();
}

function getGoogleClient() {
  return new OAuth2Client(getGoogleClientId());
}

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

function formatUser(user) {
  return {
    id: user._id || user.id,
    name: user.username,
    email: user.email,
    role: user.role,
  };
}

function uniqueUsernameFromEmail(email, name) {
  const base = (name || email.split('@')[0] || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 20);
  return `${base || 'user'}_${crypto.randomBytes(3).toString('hex')}`;
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.createUser({
      username: name,
      email,
      password,
    });

    res.status(201).json({
      token: signToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(401).json({
        error: 'This account uses Google sign-in. Please continue with Google.',
      });
    }

    const isPasswordValid = await User.matchPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }
    const googleClientId = getGoogleClientId();
    if (!googleClientId) {
      return res.status(500).json({ error: 'Google sign-in is not configured' });
    }

    const ticket = await getGoogleClient().verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email?.split('@')[0];

    if (!email) {
      return res.status(400).json({ error: 'Google account email is required' });
    }

    let user = await User.findByGoogleIdOrEmail(googleId, email);

    if (user) {
      if (!user.googleId) {
        user = await User.updateUser(user._id, { googleId });
      }
    } else {
      user = await User.createUser({
        username: uniqueUsernameFromEmail(email, name),
        email,
        googleId,
      });
    }

    res.json({
      token: signToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const generic = {
      message: 'If an account exists for that email, a reset link has been sent.',
    };

    if (!email) {
      return res.json(generic);
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.json(generic);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.updateUser(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (mailError) {
      console.error(mailError);
      await User.updateUser(user._id, {
        passwordResetToken: null,
        passwordResetExpires: null,
      });
      return res.status(500).json({ error: 'Could not send reset email. Try again later.' });
    }

    return res.json(generic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findByResetToken(hashedToken);

    if (!user) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired' });
    }

    const updated = await User.updateUser(user._id, {
      password,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    res.json({
      token: signToken(updated._id),
      user: formatUser(updated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
};
