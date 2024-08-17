import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, HStack, Image, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={10} align="stretch">
          <HStack spacing={10} alignItems="center" justify="space-between">
            <VStack align="start" spacing={5} maxW="lg">
              <Heading as="h1" size="2xl" color="blue.500">
                Smart Event Management
              </Heading>
              <Text fontSize="xl" color={textColor}>
                Discover, create, and manage events effortlessly. Join a community of event enthusiasts and organizers.
              </Text>
              <HStack spacing={4}>
                <Button as={RouterLink} to="/events" colorScheme="blue" size="lg">
                  Explore Events
                </Button>
                <Button as={RouterLink} to="/create-event" colorScheme="green" size="lg">
                  Create Event
                </Button>
              </HStack>
            </VStack>
            <Image
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3"
              alt="Event Management"
              borderRadius="md"
              boxShadow="2xl"
              maxW="xl"
            />
          </HStack>

          <VStack spacing={8} align="stretch" mt={16}>
            <Heading as="h2" size="xl" textAlign="center" color="purple.500">
              Why Choose Smart Event Management?
            </Heading>
            <HStack spacing={8} align="stretch">
              {[
                { title: 'Easy Creation', desc: 'Create and manage events with just a few clicks.' },
                { title: 'Real-time Updates', desc: 'Get instant notifications about event changes and updates.' },
                { title: 'Analytics', desc: 'Gain insights with powerful analytics and reporting tools.' },
              ].map((feature, index) => (
                <Box key={index} bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="lg" boxShadow="md" flex={1}>
                  <Heading as="h3" size="lg" mb={4} color="teal.500">
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>{feature.desc}</Text>
                </Box>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;