import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  MenuButton,
  MenuDivider,
  Menu,
  MenuList,
  MenuItem,
 chakra } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useContext } from "react";
import { BiDollar, BiTransfer } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { useHistory , NavLink } from "react-router-dom";

import logo from "../assets/dyon.png";
import { colors } from "../config";
import { UserContext } from "../contexts/UserContext";


const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: white;
    color: ${colors.brand};
  }
`;

const Header = (props: any) => {
  const { methods, fullName } = useContext(UserContext);
  const history = useHistory();

  const logoutPress = async () => {
    methods.logout();
    history.push("/signin");
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      bg={colors.brand}
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <NavLink to="/market">
          <chakra.img src={logo} {...props} style={{ height: 50, width: 50 }} />
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
        <NavLink
          to="/market"
          activeStyle={{
            borderBottomColor: colors.highlight,
            borderBottomWidth: "3px",
          }}
        >
          <Text px="1">Market</Text>
        </NavLink>
        <NavLink
          to="/portfolio"
          activeStyle={{
            borderBottomColor: colors.highlight,
            borderBottomWidth: "3px",
          }}
        >
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
              textColor: colors.brand,
            }}
            _active={{
              bg: "white",
              textColor: colors.brand,
            }}
            as={Button}
            leftIcon={<BiDollar />}
          >
            USD
          </MenuButton>
          <MenuList style={{ background: colors.brand }}>
            <StyledMenuItem>SGD</StyledMenuItem>
            <StyledMenuItem>USD</StyledMenuItem>
            <StyledMenuItem>AUD</StyledMenuItem>
            <StyledMenuItem>CAD</StyledMenuItem>
            <StyledMenuItem>EUR</StyledMenuItem>
            <StyledMenuItem>GBP</StyledMenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Box
        display={{ base: "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
        px="2"
      >
        <Menu closeOnBlur>
          <MenuButton
            variant="outline"
            _hover={{
              bg: "white",
              textColor: colors.brand,
            }}
            _active={{
              bg: "white",
              textColor: colors.brand,
            }}
            as={Button}
            leftIcon={<BiTransfer />}
          >
            Transfer
          </MenuButton>
          <MenuList style={{ background: colors.brand }}>
            <StyledMenuItem>Deposit</StyledMenuItem>
            <StyledMenuItem>Withdraw</StyledMenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box display={{ base: "none", md: "block" }} mt={{ base: 4, md: 0 }}>
        <Menu>
          <MenuButton
            variant="outline"
            _hover={{
              bg: "white",
              textColor: colors.brand,
            }}
            _active={{
              bg: "white",
              textColor: colors.brand,
            }}
            as={Button}
            leftIcon={<BsPerson />}
          >
            Account
          </MenuButton>
          <MenuList style={{ background: colors.brand }}>
            <Text py="1" px="2" fontWeight="bold" color="light-grey">
              {fullName}
            </Text>
            <MenuDivider />
            <MenuItem
              _hover={{ bg: "white", textColor: colors.brand }}
              _focus={{ bg: "white", textColor: colors.brand }}
            >
              Settings
            </MenuItem>
            <NavLink to="/pendingorders">
              <StyledMenuItem>Pending Orders</StyledMenuItem>
            </NavLink>
            <NavLink to="/completedorders">
              <StyledMenuItem>Completed Orders</StyledMenuItem>
            </NavLink>
            <NavLink to="/redeem">
              <StyledMenuItem>Redeem</StyledMenuItem>
            </NavLink>
            <StyledMenuItem>FAQ</StyledMenuItem>
            <StyledMenuItem>Legal</StyledMenuItem>
            <MenuItem
              _hover={{ bg: "white", textColor: colors.brand }}
              onClick={logoutPress}
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
