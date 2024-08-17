import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Text, VStack, HStack, Badge, Button, useColorModeValue } from '@chakra-ui/react';


const fetchEventDetails = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: 'Tech Conference 2024',
        date: '2024-09-15',
        time: '09:00 AM - 05:00 PM',
        location: 'Convention Center, New Delhi',
        description: 'Join us for the biggest tech conference of the year. Featuring keynote speakers, workshops, and networking opportunities.',
        category: 'Technology',
        attendees: 500,
        organizer: 'Tech Events Inc.'
      });
    }, 1000);
  });
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  useEffect(() => {
    fetchEventDetails(id).then(data => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <Container maxW="container.lg" py={10}><Text>Loading event details...</Text></Container>;
  }

  if (!event) {
    return <Container maxW="container.lg" py={10}><Text>Event not found.</Text></Container>;
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="2xl" color="blue.500">{event.title}</Heading>
          
          <HStack spacing={4}>
            <Badge colorScheme="blue" fontSize="md">{event.category}</Badge>
            <Badge colorScheme="green" fontSize="md">{event.attendees} attendees</Badge>
          </HStack>
          
          <VStack align="stretch" spacing={3} bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="md" boxShadow="md">
            <Text fontSize="lg"><strong>Date:</strong> {event.date}</Text>
            <Text fontSize="lg"><strong>Time:</strong> {event.time}</Text>
            <Text fontSize="lg"><strong>Location:</strong> {event.location}</Text>
            <Text fontSize="lg"><strong>Organizer:</strong> {event.organizer}</Text>
          </VStack>
          
          <Box>
            <Heading as="h2" size="lg" mb={3}>Event Description</Heading>
            <Text color={textColor}>{event.description}</Text>
          </Box>
          
          <Button colorScheme="blue" size="lg">Register for Event</Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default EventDetails;