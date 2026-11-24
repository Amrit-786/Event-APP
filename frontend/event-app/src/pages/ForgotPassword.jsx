import React, { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Link,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import api from '../api/client';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = (searchParams.get('email') || '').trim();
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required';
    if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      toast({
        title: 'Invalid email',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setEmailError('');
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', {
        email: email.trim(),
      });
      toast({
        title: 'Check your email',
        description:
          data.message ||
          'If an account exists for that email, a reset link has been sent.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not send reset email.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100%" py={{ base: 8, md: 12 }}>
      <Container maxW="container.sm">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
            Forgot password
          </Heading>
          <Text textAlign="center" color="gray.500" fontSize="sm">
            Enter your email and we&apos;ll send a reset link if an account exists.
            Google-only accounts should use Google sign-in instead.
          </Text>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <form onSubmit={handleSubmit} noValidate>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={Boolean(emailError)}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    size="lg"
                    autoComplete="email"
                    autoFocus
                  />
                  {emailError ? <FormErrorMessage>{emailError}</FormErrorMessage> : null}
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Send reset link
                </Button>
              </VStack>
            </form>
          </Box>

          <Text textAlign="center" fontSize="sm">
            <Link as={RouterLink} to="/auth" color="teal.500">
              Back to login
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
