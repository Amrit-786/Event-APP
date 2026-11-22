import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
  Avatar,
  Button,
  Spinner,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import api from '../api/client';
import { getStoredUser, formatEventDate } from '../utils/auth';

const Profile = () => {
  const user = getStoredUser();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const loadRegisteredEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      const all = Array.isArray(data) ? data : [];
      const registered = all.filter((event) =>
        event.participants?.some((p) => {
          const participantId = typeof p === 'string' ? p : p._id;
          return participantId?.toString() === user?.id?.toString();
        })
      );
      setEvents(registered);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegisteredEvents();
  }, []);

  const handleCancel = async (eventId) => {
    setCancellingId(eventId);
    try {
      await api.delete(`/events/${eventId}/register`);
      toast({
        title: 'Cancelled',
        description: 'Registration cancelled.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await loadRegisteredEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Could not cancel.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  const EventRow = ({ event, showCancel }) => (
    <Stack
      key={event._id}
      direction={{ base: 'column', sm: 'row' }}
      justify="space-between"
      align={{ base: 'stretch', sm: 'center' }}
      gap={3}
      borderWidth="1px"
      borderColor={border}
      borderRadius="md"
      p={4}
    >
      <Box>
        <Text fontWeight="bold" noOfLines={2}>
          {event.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {formatEventDate(event.date)}
        </Text>
      </Box>
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
        <Button as={RouterLink} to={`/events/${event._id}`} size="sm" w={{ base: '100%', sm: 'auto' }}>
          View
        </Button>
        {showCancel && (
          <Button
            size="sm"
            colorScheme="orange"
            onClick={() => handleCancel(event._id)}
            isLoading={cancellingId === event._id}
            w={{ base: '100%', sm: 'auto' }}
          >
            Cancel
          </Button>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Box bg={bgColor} minH="100%" py={{ base: 6, md: 10 }}>
      <Container maxW="container.md">
        <VStack spacing={{ base: 5, md: 8 }} align="stretch">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
            Your Profile
          </Heading>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={5}
              align={{ base: 'center', sm: 'flex-start' }}
              textAlign={{ base: 'center', sm: 'left' }}
            >
              <Avatar size={{ base: 'xl', md: '2xl' }} name={user?.name || 'User'} />
              <VStack align={{ base: 'center', sm: 'start' }} spacing={2}>
                <Heading as="h2" size="lg">
                  {user?.name || 'User'}
                </Heading>
                <Text fontSize="md" color="gray.500" wordBreak="break-word">
                  {user?.email}
                </Text>
                <Badge colorScheme={user?.role === 'admin' ? 'purple' : 'teal'}>
                  {user?.role || 'user'}
                </Badge>
                <Text fontSize="md" pt={2}>
                  <strong>Registered events:</strong> {events.length}
                </Text>
              </VStack>
            </Stack>
          </Box>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <Heading as="h3" size="md" mb={4}>
              Upcoming Events
            </Heading>
            {loading ? (
              <HStack>
                <Spinner size="sm" color="teal.500" />
                <Text>Loading...</Text>
              </HStack>
            ) : upcoming.length === 0 ? (
              <Text color="gray.500">You have no upcoming events.</Text>
            ) : (
              <VStack align="stretch" spacing={3}>
                {upcoming.map((event) => (
                  <EventRow key={event._id} event={event} showCancel />
                ))}
              </VStack>
            )}
          </Box>

          <Box
            bg={cardBgColor}
            p={{ base: 5, md: 8 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <Heading as="h3" size="md" mb={4}>
              Past Events
            </Heading>
            {loading ? (
              <Text>Loading...</Text>
            ) : past.length === 0 ? (
              <Text color="gray.500">You haven&apos;t attended any events yet.</Text>
            ) : (
              <VStack align="stretch" spacing={3}>
                {past.map((event) => (
                  <EventRow key={event._id} event={event} showCancel={false} />
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;
