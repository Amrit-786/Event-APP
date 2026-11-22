import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  Select,
  Button,
  Text,
  VStack,
  HStack,
  Stack,
  Badge,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/client';
import { formatEventDate } from '../utils/auth';

const EventCard = ({ event }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const attendees = event.participants?.length ?? 0;

  return (
    <Box
      p={{ base: 4, md: 5 }}
      borderWidth="1px"
      borderColor={border}
      borderRadius="lg"
      bg={cardBg}
      h="100%"
      display="flex"
      flexDirection="column"
      style={{ contain: 'content' }}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Heading fontSize={{ base: 'lg', md: 'xl' }} mb={2} noOfLines={2}>
        {event.name}
      </Heading>
      <Text color={textColor} mb={3} fontSize="sm">
        {formatEventDate(event.date)}
        {event.location ? ` · ${event.location}` : ''}
      </Text>
      <HStack flexWrap="wrap" spacing={2} mb={4}>
        <Badge bg="brand.500" color="white">{event.category}</Badge>
        <Badge colorScheme="green">
          {attendees}/{event.maxParticipants}
        </Badge>
      </HStack>
      <Button
        as={RouterLink}
        to={`/events/${event._id}`}
        mt="auto"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                size="md"
                w="100%"
              >
                View Details
              </Button>
    </Box>
  );
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const filterBg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const loadEvents = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const hasFilters =
        filters.name || filters.category || filters.startDate || filters.endDate;

      if (hasFilters) {
        const { data } = await api.get('/events/search', {
          params: {
            name: filters.name || undefined,
            category: filters.category || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            limit: 50,
          },
        });
        setEvents(data.events || []);
      } else {
        const { data } = await api.get('/events');
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadEvents({
        name: searchTerm.trim(),
        category: categoryFilter,
        startDate,
        endDate,
      });
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, categoryFilter, startDate, endDate]);

  const setUpcomingOnly = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate('');
  };

  return (
    <Box bg={pageBg} minH="100%" py={{ base: 6, md: 10 }}>
      <Container maxW="container.xl">
        <VStack spacing={{ base: 5, md: 8 }} align="stretch">
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '4xl' }}
            textAlign={{ base: 'left', md: 'center' }}
          >
            Upcoming Events
          </Heading>

          <Box
            bg={filterBg}
            borderWidth="1px"
            borderColor={border}
            borderRadius="lg"
            p={{ base: 4, md: 5 }}
          >
            <VStack spacing={3} align="stretch">
              <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="md"
                  bg={pageBg}
                />
                <Select
                  placeholder="All Categories"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  maxW={{ md: '220px' }}
                  bg={pageBg}
                >
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Food">Food</option>
                  <option value="Business">Business</option>
                  <option value="Art">Art</option>
                </Select>
              </Stack>

              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Start date"
                  bg={pageBg}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="End date"
                  bg={pageBg}
                />
              </Stack>

              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                <Button onClick={setUpcomingOnly} variant="outline" w={{ base: '100%', sm: 'auto' }}>
                  Upcoming
                </Button>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  variant="ghost"
                  w={{ base: '100%', sm: 'auto' }}
                >
                  Clear filters
                </Button>
              </Stack>
            </VStack>
          </Box>

          {loading ? (
            <HStack justify="center" py={10}>
              <Spinner color="teal.500" />
              <Text>Loading events...</Text>
            </HStack>
          ) : error ? (
            <Text textAlign="center" color="red.400">
              {error}
            </Text>
          ) : events.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="gray.500" py={8}>
              No events found matching your criteria.
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EventList;
