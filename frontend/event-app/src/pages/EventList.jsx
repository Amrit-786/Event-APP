import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid, Input, Select, Button, Text, VStack, HStack, Badge, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


const fetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Tech Conference 2024', date: '2024-09-15', category: 'Technology', attendees: 500 },
        { id: 2, title: 'Music Festival', date: '2024-07-22', category: 'Music', attendees: 10000 },
        { id: 3, title: 'Food & Wine Expo', date: '2024-08-05', category: 'Food', attendees: 2000 },
        { id: 4, title: 'Startup Pitch Night', date: '2024-10-10', category: 'Business', attendees: 200 },
        { id: 5, title: 'Art Gallery Opening', date: '2024-11-01', category: 'Art', attendees: 300 },
      ]);
    }, 1000);
  });
};

const EventCard = ({ event }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
      <Heading fontSize="xl" mb={2}>{event.title}</Heading>
      <Text color={textColor} mb={2}>Date: {event.date}</Text>
      <HStack>
        <Badge colorScheme="blue">{event.category}</Badge>
        <Badge colorScheme="green">{event.attendees} attendees</Badge>
      </HStack>
      <Button as={RouterLink} to={`/events/${event.id}`} mt={4} colorScheme="blue" size="sm">
        View Details
      </Button>
    </Box>
  );
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === '' || event.category === categoryFilter)
  );

  return (
    <Box minH="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" mb={6}>
            Upcoming Events
          </Heading>

          <HStack spacing={4}>
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All Categories"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Food">Food</option>
              <option value="Business">Business</option>
              <option value="Art">Art</option>
            </Select>
          </HStack>

          {loading ? (
            <Text textAlign="center">Loading events...</Text>
          ) : filteredEvents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center">No events found matching your criteria.</Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EventList;