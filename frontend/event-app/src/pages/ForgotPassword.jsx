import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
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
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
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
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
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
