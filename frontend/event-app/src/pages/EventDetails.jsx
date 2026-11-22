import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
  Badge,
  Button,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import api from '../api/client';
import { getStoredUser, isAdminUser, formatEventDate } from '../utils/auth';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const user = getStoredUser();
  const isAdmin = isAdminUser(user);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const loadEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const isRegistered = Boolean(
    event?.participants?.some((p) => {
      const participantId = typeof p === 'string' ? p : p._id;
      return participantId?.toString() === user?.id?.toString();
    })
  );

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/events/${id}/register`);
      toast({
        title: 'Registered',
        description: 'You are registered for this event.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await loadEvent();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Could not register.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/register`);
      toast({
        title: 'Cancelled',
        description: 'Your registration was cancelled.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await loadEvent();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Could not cancel registration.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}`);
      toast({
        title: 'Deleted',
        description: 'Event deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/events');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Could not delete event.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={10}>
        <HStack>
          <Spinner color="teal.500" />
          <Text>Loading event details...</Text>
        </HStack>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="container.lg" py={10}>
        <Text>Event not found.</Text>
      </Container>
    );
  }

  const attendees = event.participants?.length ?? 0;

  return (
    <Box bg={bgColor} minH="100%" py={{ base: 6, md: 10 }}>
      <Container maxW="container.lg">
        <VStack spacing={{ base: 5, md: 6 }} align="stretch">
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '4xl' }}
            color="brand.600"
            lineHeight="1.15"
          >
            {event.name}
          </Heading>

          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="teal" fontSize="sm" px={2} py={1} bg="brand.500" color="white">
              {event.category}
            </Badge>
            <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
              {attendees}/{event.maxParticipants} attendees
            </Badge>
            <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
              {event.status}
            </Badge>
          </HStack>

          <VStack
            align="stretch"
            spacing={3}
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={border}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              <strong>Date:</strong> {formatEventDate(event.date)}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              <strong>Time:</strong> {event.time}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              <strong>Location:</strong> {event.location}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }}>
              <strong>Organizer:</strong> {event.organizer?.username || 'Unknown'}
            </Text>
          </VStack>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              About this event
            </Heading>
            <Text color={textColor} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
              {event.description}
            </Text>
          </Box>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} pt={2}>
            {isRegistered ? (
              <Button
                colorScheme="orange"
                size="lg"
                onClick={handleCancel}
                isLoading={actionLoading}
                w={{ base: '100%', sm: 'auto' }}
              >
                Cancel Registration
              </Button>
            ) : (
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleRegister}
                isLoading={actionLoading}
                w={{ base: '100%', sm: 'auto' }}
              >
                Register for Event
              </Button>
            )}

            {isAdmin && (
              <>
                <Button
                  as={RouterLink}
                  to={`/events/${id}/edit`}
                  colorScheme="teal"
                  size="lg"
                  variant="outline"
                  w={{ base: '100%', sm: 'auto' }}
                >
                  Edit Event
                </Button>
                <Button
                  colorScheme="red"
                  size="lg"
                  variant="outline"
                  onClick={handleDelete}
                  isLoading={actionLoading}
                  w={{ base: '100%', sm: 'auto' }}
                >
                  Delete Event
                </Button>
              </>
            )}
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
};

export default EventDetails;
