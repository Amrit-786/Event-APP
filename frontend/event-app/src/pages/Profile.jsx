import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Event Organizer',
    eventsCreated: 5,
    eventsAttended: 12,
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            User Profile
          </Heading>

          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <HStack spacing={6}>
                <Avatar size="2xl" name={user.name} src="https://bit.ly/broken-link" />
                <VStack align="start" spacing={2}>
                  <Heading as="h2" size="lg">
                    {user.name}
                  </Heading>
                  <Text fontSize="md" color="gray.500">
                    {user.email}
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="blue.500">
                    {user.role}
                  </Text>
                </VStack>
              </HStack>

              <VStack align="start" spacing={3}>
                <Text fontSize="lg">
                  <strong>Events Created:</strong> {user.eventsCreated}
                </Text>
                <Text fontSize="lg">
                  <strong>Events Attended:</strong> {user.eventsAttended}
                </Text>
              </VStack>

              <Button colorScheme="blue">Edit Profile</Button>
            </VStack>
          </Box>

          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="md" mb={4}>
              Upcoming Events
            </Heading>
            <Text>You have no upcoming events.</Text>
          </Box>

          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="md" mb={4}>
              Past Events
            </Heading>
            <Text>You haven't attended any events yet.</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;