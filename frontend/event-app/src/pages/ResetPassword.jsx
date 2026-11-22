import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
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
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import api from '../api/client';

const ResetPassword = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Invalid link',
        description: 'This reset link is missing a token.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin?.();
      toast({
        title: 'Password updated',
        description: 'You are now signed in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(data.user?.role === 'admin' ? '/create-event' : '/events');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Could not reset password.',
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
            Set a new password
          </Heading>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>New password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    autoComplete="new-password"
                    minLength={6}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirm password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="lg"
                    autoComplete="new-password"
                    minLength={6}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Update password
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

export default ResetPassword;
