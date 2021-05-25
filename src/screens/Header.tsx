import React, { useContext } from "react";
import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  useDisclosure,
  MenuButton,
  Menu,
  MenuList,
  Divider,
  MenuItem,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import logo from "../assets/dyon.png";
import { NavLink } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { UserContext } from "../contexts/UserContext";

const Header = (props: any) => {
  const { logout } = useContext(UserContext);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      bg="#000029"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <chakra.img src={logo} {...props} style={{ height: 50, width: 50 }} />
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
        <NavLink to="/market">
          <Text px="1">Market</Text>
        </NavLink>
        <NavLink to="/portfolio">
          <Text px="1">Portfolio</Text>
        </NavLink>
      </Stack>

      <Box
        display={{ base: "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
        px="2"
      >
        <Menu>
          <MenuButton
            variant="outline"
            _hover={{
              bg: "white",
              textColor: "#000029",
            }}
            _active={{
              bg: "white",
              textColor: "#000029",
            }}
            as={Button}
            leftIcon={<BiTransfer />}
          >
            Transfer
          </MenuButton>
          <MenuList style={{ background: "#000029" }}>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Deposit
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Withdraw
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box display={{ base: "none", md: "block" }} mt={{ base: 4, md: 0 }}>
        <Menu>
          <MenuButton
            variant="outline"
            _hover={{
              bg: "white",
              textColor: "#000029",
            }}
            _active={{
              bg: "white",
              textColor: "#000029",
            }}
            as={Button}
            leftIcon={<BsPerson />}
          >
            Account
          </MenuButton>
          <MenuList style={{ background: "#000029" }}>
            <Text padding="2" fontWeight="bold" color="light-grey">
              Conor Brosnan
            </Text>
            <Divider style={{ color: "grey" }} />
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Settings
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Balances
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Redeem
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              FAQ
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: "#000029" }}>
              Legal
            </MenuItem>
            <MenuItem
              _hover={{ bg: "white", textColor: "#000029" }}
              onClick={logout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default Header;
