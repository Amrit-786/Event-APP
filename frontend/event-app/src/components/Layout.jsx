import React from 'react';
import { Box, Flex, Spacer, Link, Button, useColorMode, useColorModeValue, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const Layout = ({ children, isAuthenticated, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode(); 
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      onLogout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <Box>
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={bgColor} color={textColor}>
        <Flex align="center" mr={5}>
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
            Smart Events
          </Link>
        </Flex>

        <Spacer />

        <Box>
          <Link as={RouterLink} to="/events" mr={4}>
            Events
          </Link>
          {isAuthenticated && (
            <>
              <Link as={RouterLink} to="/create-event" mr={4}>
                Create Event
              </Link>
              <Link as={RouterLink} to="/profile" mr={4}>
                Profile
              </Link>
            </>
          )}
          <Button onClick={handleAuthAction} mr={4}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
          <Button onClick={toggleColorMode} size="sm" leftIcon={<Icon as={colorMode === 'light' ? FaSun : FaMoon} />}>
            
          </Button>
        </Box>
      </Flex>

      <Box as="main">
        {children}
      </Box>

      <Box as="footer" mt={12} py={6} textAlign="center" bg={bgColor} color={textColor}>
        © 2024 Smart Event Management. All rights reserved.
      </Box>
    </Box>
  );
};

export default Layout;
