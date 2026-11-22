import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Spinner,
  Text,
  SimpleGrid,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../api/client';

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  category: '',
  maxAttendees: '',
};

const CreateEvent = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [eventData, setEventData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  useEffect(() => {
    if (!isEdit) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/events/${id}`);
        setEventData({
          title: data.name || '',
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
          time: data.time || '',
          location: data.location || '',
          description: data.description || '',
          category: data.category || '',
          maxAttendees: data.maxParticipants?.toString() || '',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Could not load event.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, isEdit, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      description: eventData.description,
      category: eventData.category,
      maxParticipants: Number(eventData.maxAttendees),
    };

    try {
      if (isEdit) {
        await api.put(`/events/${id}`, payload);
        toast({
          title: 'Event Updated',
          description: 'Your event has been updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate(`/events/${id}`);
      } else {
        await api.post('/events', payload);
        toast({
          title: 'Event Created',
          description: "We've created your event for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEventData(emptyForm);
        navigate('/events');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not save the event. Please try again.';
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={10}>
        <Spinner mr={3} color="teal.500" />
        <Text as="span">Loading event...</Text>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100%" py={{ base: 6, md: 10 }}>
      <Container maxW="container.md">
        <VStack spacing={{ base: 5, md: 8 }} align="stretch">
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
            {isEdit ? 'Edit Event' : 'Create New Event'}
          </Heading>

          <Box
            as="form"
            onSubmit={handleSubmit}
            bg={cardBg}
            borderWidth="1px"
            borderColor={border}
            borderRadius="lg"
            p={{ base: 4, md: 8 }}
          >
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  size="lg"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    bg={inputBgColor}
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name="time"
                    type="time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    bg={inputBgColor}
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  minH="120px"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={eventData.category}
                    onChange={handleInputChange}
                    placeholder="Select category"
                    bg={inputBgColor}
                    size="lg"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Food">Food</option>
                    <option value="Business">Business</option>
                    <option value="Art">Art</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Maximum Attendees</FormLabel>
                  <Input
                    name="maxAttendees"
                    type="number"
                    min={1}
                    value={eventData.maxAttendees}
                    onChange={handleInputChange}
                    bg={inputBgColor}
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                isLoading={isSubmitting}
                mt={2}
              >
                {isEdit ? 'Save Changes' : 'Create Event'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateEvent;
