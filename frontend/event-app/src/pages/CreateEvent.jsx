import React, { useState } from 'react';
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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    maxAttendees: '',
  });

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const inputBgColor = useColorModeValue('white', 'gray.700');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log('Event Data:', eventData);
    toast({
      title: 'Event Created',
      description: "We've created your event for you.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  
    setEventData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: '',
      maxAttendees: '',
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Create New Event
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <Input
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                  bg={inputBgColor}
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
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={eventData.category}
                  onChange={handleInputChange}
                  placeholder="Select category"
                  bg={inputBgColor}
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
                  value={eventData.maxAttendees}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg" width="full">
                Create Event
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateEvent;