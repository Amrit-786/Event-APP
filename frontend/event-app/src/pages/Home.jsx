import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Stack,
  SimpleGrid,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// LCP: hero brand mark + wordmark
const Home = ({ isAdmin, isAuthenticated }) => {
  const featureBg = useColorModeValue('white', 'gray.800');
  const featureBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const muted = useColorModeValue('gray.600', 'gray.300');
  const heroBg = useColorModeValue(
    'linear-gradient(160deg, #E8FFFB 0%, #F7FFFD 40%, #D8F5F1 100%)',
    'linear-gradient(160deg, #051F1E 0%, #0B3D3A 55%, #08302E 100%)'
  );
  const brandFilter = useColorModeValue('none', 'brightness(0) invert(1)');
  const taglineColor = useColorModeValue('brand.700', 'brand.100');

  return (
    <Box>
      <Box
        position="relative"
        minH={{ base: '78vh', md: '70vh' }}
        display="flex"
        alignItems="center"
        overflow="hidden"
        bg={heroBg}
      >
        <Box
          position="absolute"
          inset={0}
          opacity={0.35}
          backgroundImage="radial-gradient(circle at 20% 20%, #00A89E33 0%, transparent 40%), radial-gradient(circle at 85% 70%, #00A89E22 0%, transparent 35%)"
          pointerEvents="none"
        />

        <Container
          maxW="container.xl"
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 20 }}
        >
          <VStack
            align={{ base: 'center', md: 'start' }}
            textAlign={{ base: 'center', md: 'left' }}
            spacing={{ base: 5, md: 6 }}
            maxW={{ base: '100%', md: '2xl' }}
          >
            <Image
              src="/brand/popin-logo.svg"
              alt="popin."
              h={{ base: '64px', sm: '80px', md: '96px' }}
              w="auto"
              maxW="100%"
              filter={brandFilter}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={360}
              height={84}
            />

            <VStack spacing={2} align={{ base: 'center', md: 'start' }}>
              <Heading
                as="h1"
                fontSize={{ base: '1.75rem', sm: '2.25rem', md: '2.75rem' }}
                lineHeight="1.15"
                letterSpacing="-0.02em"
                color={taglineColor}
                fontWeight="700"
              >
                Find your people.
                <Box as="br" display={{ base: 'none', sm: 'block' }} />
                {' '}Find your vibe.
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'xl' }}
                color={muted}
                maxW="34rem"
              >
                Discover events. Make memories. Pop in.
              </Text>
            </VStack>

            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={3}
              w={{ base: '100%', sm: 'auto' }}
              pt={1}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <Button
                as={RouterLink}
                to="/events"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                size="lg"
                w={{ base: '100%', sm: 'auto' }}
              >
                Explore Events
              </Button>
              {isAuthenticated && isAdmin ? (
                <Button
                  as={RouterLink}
                  to="/create-event"
                  size="lg"
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.600"
                  w={{ base: '100%', sm: 'auto' }}
                >
                  Create Event
                </Button>
              ) : (
                <Button
                  as={RouterLink}
                  to="/auth"
                  size="lg"
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.600"
                  w={{ base: '100%', sm: 'auto' }}
                >
                  Get Started
                </Button>
              )}
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Box bg={sectionBg} py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: 8, md: 10 }} align="stretch">
            <Heading
              as="h2"
              size={{ base: 'lg', md: 'xl' }}
              textAlign="center"
              color="brand.500"
            >
              Why popin.
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }}>
              {[
                {
                  title: 'Find your people',
                  desc: 'Join gatherings that match your interests and energy.',
                },
                {
                  title: 'Find your vibe',
                  desc: 'Browse by category, date, and mood — then show up.',
                },
                {
                  title: 'Make memories',
                  desc: 'Register in one tap. Cancel anytime. Just pop in.',
                },
              ].map((feature) => (
                <Box
                  key={feature.title}
                  bg={featureBg}
                  borderWidth="1px"
                  borderColor={featureBorder}
                  p={{ base: 5, md: 6 }}
                  borderRadius="lg"
                  style={{ contain: 'content' }}
                >
                  <Heading as="h3" size="md" mb={3} color="brand.600">
                    {feature.title}
                  </Heading>
                  <Text color={muted} fontSize={{ base: 'sm', md: 'md' }}>
                    {feature.desc}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
