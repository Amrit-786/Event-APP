const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'username')
      .populate('participants', 'username email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('participants', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.participants.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    event.participants.push(req.user._id);
    await event.save();
    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const before = event.participants.length;
    event.participants = event.participants.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    if (event.participants.length === before) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    await event.save();
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const {
      name,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc',
    } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: [
        { path: 'organizer', select: 'username' },
        { path: 'participants', select: 'username email' },
      ],
    };

    const result = await Event.paginate(query, options);

    res.json({
      events: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalEvents: result.totalDocs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
