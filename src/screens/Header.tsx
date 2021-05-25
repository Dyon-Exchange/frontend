import React, { useContext } from "react";
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
  color,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import logo from "../assets/dyon.png";
import { NavLink, Redirect } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { BiDollar, BiTransfer } from "react-icons/bi";
import { UserContext } from "../contexts/UserContext";
import { colors } from "../config";

const Header = (props: any) => {
  const { logout, fullName } = useContext(UserContext);

  const logoutPress = async () => {
    logout();
    return <Redirect to="/signin" />;
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
        <NavLink to="/">
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
            <MenuItem
              _hover={{ bg: "white", textColor: colors.brand }}
              _focus={{ bg: "white", textColor: colors.brand }}
            >
              SGD
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              USD
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              AUD
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              CAD
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              EUR
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              GBP
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Box
        display={{ base: "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
        px="2"
      >
        <Menu closeOnBlur={true}>
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
            <MenuItem
              _hover={{ bg: "white", textColor: colors.brand }}
              _focus={{ bg: "white", textColor: colors.brand }}
            >
              Deposit
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
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
            <NavLink to="/balances">
              <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
                Balances
              </MenuItem>
            </NavLink>
            <NavLink to="/redeem">
              <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
                Redeem
              </MenuItem>
            </NavLink>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              FAQ
            </MenuItem>
            <MenuItem _hover={{ bg: "white", textColor: colors.brand }}>
              Legal
            </MenuItem>
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
