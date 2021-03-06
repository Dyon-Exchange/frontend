import { Box, Stack, Flex, Text, Button, chakra } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

import logo from "../assets/dyon-white-text.png";
import { colors } from "../config";

const Header = () => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    padding={2}
    bg={colors.brand}
    color="white"
  >
    <Flex align="center" mr={5}>
      <NavLink to="/">
        <chakra.img src={logo} style={{ width: 156.6, height: 54.5 }} />
      </NavLink>
    </Flex>
    <Stack
      direction={{ base: "column", md: "row" }}
      display={{ base: "none", md: "flex" }}
      width={{ base: "full", md: "auto" }}
      alignItems="center"
      flexGrow={1}
      mt={{ base: 4, md: 0 }}
      style={{ fontWeight: "bold" }}
    >
      <Text px="1">Products</Text>
      <NavLink to="/market">
        <Text px="1">Prices</Text>
      </NavLink>
      <Text px="1">Resources</Text>
    </Stack>

    <Box display={{ base: "none", md: "block" }} mt={{ base: 4, md: 0 }} px="2">
      {" "}
      <NavLink to="/signin">
        <Button
          variant="outline"
          _hover={{
            bg: "white",
            borderColor: "teal.700",
            textColor: "#00008b",
          }}
        >
          Sign in
        </Button>
      </NavLink>
    </Box>
    <Box display={{ base: "none", md: "block" }} mt={{ base: 4, md: 0 }}>
      <Button
        variant="outline"
        _hover={{
          bg: "white",
          borderColor: "teal.700",
          textColor: "#00008b",
        }}
      >
        Get Started
      </Button>
    </Box>
  </Flex>
);

export default Header;
