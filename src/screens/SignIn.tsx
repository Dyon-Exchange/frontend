import React, { useContext, useState } from "react";
import {
  Heading,
  Flex,
  Box,
  FormControl,
  Button,
  Stack,
  Input,
  InputGroup,
  HStack,
  chakra,
  Select,
  VStack,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import { UserContext } from "../contexts/UserContext";
import { useForm } from "react-hook-form";
import logo from "../assets/dyon.png";

export const SignIn = () => {
  const { login } = useContext(UserContext);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (e) {
      if (e.response.status === 401) {
        window.alert("Your password was incorrect");
      } else if (e.response.status === 404) {
        window.alert("No user with that email exists");
      } else {
        window.alert("There was an error logging you in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex style={{ minHeight: "90vh" }} direction="column" px="2rem">
      <Box alignSelf="center" bg="white" rounded="2px" width="450px" my="6">
        <Box
          alignContent="center"
          pt="0"
          mt="0"
          roundedTop="7px"
          marginBottom="10px"
          flexDirection="row"
        >
          <HStack style={{ justifyContent: "center", alignItems: "flex-end" }}>
            <Heading
              textAlign="center"
              pt="5"
              mt="10px"
              verticalAlign="center"
              fontWeight="500"
            >
              Sign In to
            </Heading>
            <chakra.img src={logo} style={{ height: 50, width: 50 }} />
            <Heading
              textAlign="center"
              pt="5"
              mt="10px"
              verticalAlign="center"
              fontWeight="500"
            >
              Dyon
            </Heading>
          </HStack>
        </Box>
        <Box>
          <Flex d="column" align="center" pt="5" flexWrap="wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <Stack
                  maxWidth="85%"
                  margin="auto"
                  padding="0"
                  marginBottom="20px"
                  alignItems="center"
                >
                  <InputGroup width="80%">
                    <Select
                      id="email"
                      backgroundColor="gray.200"
                      fontSize="1rem"
                      rounded="7px"
                      border="none"
                      {...register("email", { required: true })}
                    >
                      <option value="jeremy@dyon.com">jeremy@dyon.com</option>
                      <option value="conor@labrys.io">conor@labrys.io</option>
                      <option value="matilda@labrys.io">
                        matilda@labrys.io
                      </option>
                      <option value="john@dyon.com">john@dyon.com</option>
                      <option value="bob@dyon.com">bobo@dyon.com</option>
                      <option value="alice@dyon.com">alice@dyon.com</option>
                    </Select>
                  </InputGroup>
                </Stack>
                <Stack
                  maxWidth="85%"
                  margin="auto"
                  padding="0"
                  marginBottom="20px"
                  alignItems="center"
                >
                  <InputGroup width="80%">
                    <Input
                      type="password"
                      backgroundColor="gray.200"
                      rounded="7px"
                      border="none"
                      fontSize="1rem"
                      placeholder="Password"
                      {...register("password", { required: true })}
                    />
                  </InputGroup>
                </Stack>
                <Checkbox px="20" alignSelf="flex-start">
                  Remember my email address
                </Checkbox>
                <HStack
                  pt="5"
                  px="20"
                  marginBottom="20px"
                  justifyContent="space-between"
                >
                  <Button
                    variantColor="blue"
                    type="submit"
                    border="none"
                    width="50%"
                    isLoading={loading}
                  >
                    Sign in
                  </Button>
                  <VStack>
                    <Link style={{ fontSize: 12 }}>Create new account</Link>
                    <Link style={{ fontSize: 12 }}>Reset your password</Link>
                  </VStack>
                </HStack>
              </FormControl>
            </form>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};
