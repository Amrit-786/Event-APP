import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  Divider,
  HStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/client';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const finishAuth = (data, title) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    onLogin?.();
    toast({
      title,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate(data.user?.role === 'admin' ? '/create-event' : '/events');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast({
        title: 'Email required',
        description: 'Enter your email first.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate(`/forgot-password?email=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, payload);
      setEmail('');
      setPassword('');
      setName('');
      finishAuth(data, isLogin ? 'Logged In' : 'Registered');
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Authentication failed. Please try again.';
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await api.post('/auth/google', {
        credential: response.credential,
      });
      finishAuth(data, 'Signed in with Google');
    } catch (error) {
      toast({
        title: 'Google sign-in failed',
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Could not sign in with Google.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={bgColor} minH="100%" py={{ base: 8, md: 12 }}>
      <Container maxW="container.sm">
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
            {isLogin ? 'Welcome back to popin.' : 'Join popin.'}
          </Heading>
          <Text textAlign="center" color="gray.500" fontSize="sm" mt={-4}>
            Find your people. Find your vibe.
          </Text>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <VStack spacing={5} align="stretch">
              {googleClientId ? (
                <Box display="flex" justifyContent="center" w="100%">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      toast({
                        title: 'Google sign-in failed',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                      })
                    }
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="320"
                    text={isLogin ? 'signin_with' : 'signup_with'}
                  />
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Google sign-in is not configured yet. Set `VITE_GOOGLE_CLIENT_ID`.
                </Text>
              )}

              <HStack>
                <Divider />
                <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                  or continue with email
                </Text>
                <Divider />
              </HStack>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  {!isLogin && (
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        size="lg"
                        autoComplete="name"
                      />
                    </FormControl>
                  )}
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="lg"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                    />
                  </FormControl>

                  {isLogin && (
                    <Box alignSelf="flex-end">
                      <Link
                        as="button"
                        type="button"
                        fontSize="sm"
                        color="teal.500"
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </Link>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    colorScheme="teal"
                    width="full"
                    size="lg"
                    isLoading={isSubmitting}
                    mt={2}
                  >
                    {isLogin ? 'Login' : 'Register'}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          <Text textAlign="center" fontSize="sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => setIsLogin(!isLogin)}
              ml={2}
            >
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Auth;
