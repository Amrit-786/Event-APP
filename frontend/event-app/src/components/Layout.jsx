import React from 'react';
import {
  Box,
  Flex,
  Link,
  Button,
  IconButton,
  Image,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';

const Layout = ({ children, isAuthenticated, isAdmin, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const logoFilter = useColorModeValue('none', 'brightness(0) invert(1)');
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthAction = () => {
    onClose();
    if (isAuthenticated) {
      onLogout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const NavLinks = ({ stacked = false }) => (
    <Flex
      as="nav"
      direction={stacked ? 'column' : 'row'}
      align={stacked ? 'stretch' : 'center'}
      gap={stacked ? 3 : 5}
    >
      <Link
        as={RouterLink}
        to="/events"
        onClick={onClose}
        fontWeight={location.pathname.startsWith('/events') ? '700' : '500'}
        py={stacked ? 2 : 0}
      >
        Events
      </Link>
      {isAuthenticated && isAdmin && (
        <Link
          as={RouterLink}
          to="/create-event"
          onClick={onClose}
          fontWeight={location.pathname === '/create-event' ? '700' : '500'}
          py={stacked ? 2 : 0}
        >
          Create Event
        </Link>
      )}
      {isAuthenticated && (
        <Link
          as={RouterLink}
          to="/profile"
          onClick={onClose}
          fontWeight={location.pathname === '/profile' ? '700' : '500'}
          py={stacked ? 2 : 0}
        >
          Profile
        </Link>
      )}
      <Button
        onClick={handleAuthAction}
        size="sm"
        colorScheme="teal"
        w={stacked ? 'full' : 'auto'}
      >
        {isAuthenticated ? 'Logout' : 'Login'}
      </Button>
      <Button
        onClick={toggleColorMode}
        size="sm"
        aria-label="Toggle color mode"
        leftIcon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} />}
        w={stacked ? 'full' : 'auto'}
        variant="outline"
      >
        {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg={navBg}
        color={textColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        style={{ contain: 'layout paint' }}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={3}
          px={{ base: 4, md: 6 }}
          py={{ base: 2.5, md: 3 }}
          maxW="container.xl"
          mx="auto"
          w="100%"
        >
          <Link as={RouterLink} to="/" display="inline-flex" alignItems="center" aria-label="popin. home">
            <Image
              src="/brand/popin-logo.svg"
              alt="popin."
              h={{ base: '36px', md: '44px' }}
              w="auto"
              maxW={{ base: '150px', sm: '190px', md: '220px' }}
              filter={logoFilter}
            />
          </Link>

          <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
            <NavLinks />
          </HStack>

          <IconButton
            display={{ base: 'inline-flex', md: 'none' }}
            aria-label="Open menu"
            icon={<Icon as={FaBars} />}
            onClick={onOpen}
            variant="ghost"
            size="md"
            minW="44px"
            minH="44px"
          />
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top={3} right={3} />
          <DrawerHeader borderBottomWidth="1px">
            <Image
              src="/brand/popin-logo.svg"
              alt="popin."
              h="36px"
              w="auto"
              filter={logoFilter}
            />
          </DrawerHeader>
          <DrawerBody pt={6}>
            <VStack align="stretch" spacing={2}>
              <NavLinks stacked />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box as="main" flex="1" w="100%">
        {children}
      </Box>

      <Box
        as="footer"
        py={{ base: 8, md: 10 }}
        px={4}
        textAlign="center"
        bg={navBg}
        color={textColor}
        borderTopWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={3}>
          <Image
            src="/brand/popin-logo.svg"
            alt="popin."
            h="32px"
            w="auto"
            mx="auto"
            filter={logoFilter}
          />
          <Text fontSize="sm" color="gray.500" maxW="22rem" mx="auto">
            Find your people. Find your vibe. Discover events. Make memories. Pop in.
          </Text>
          <Text fontSize="xs" color="gray.500">
            © {new Date().getFullYear()} popin.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Layout;
