import React, { useState } from 'react';
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
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Auth Data:', { email, password, name });
    toast({
      title: isLogin ? 'Logged In' : 'Registered',
      description: isLogin ? "You've successfully logged in." : "You've successfully registered.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.sm">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            {isLogin ? 'Login' : 'Register'}
          </Heading>

          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {!isLogin && (
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                )}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  {isLogin ? 'Login' : 'Register'}
                </Button>
              </VStack>
            </form>
          </Box>

          <Text textAlign="center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              colorScheme="blue"
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