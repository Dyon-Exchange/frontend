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
  InputLeftElement,
} from "@chakra-ui/react";
import { BsFillLockFill, BsPersonFill } from "react-icons/bs";
import { UserContext } from "../contexts/UserContext";
import { useForm } from "react-hook-form";

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
          <Heading
            textAlign="center"
            alignSelf="center"
            pt="5"
            mt="10px"
            verticalAlign="center"
            fontWeight="500"
          >
            Sign In
          </Heading>
        </Box>
        <Box>
          <Flex d="column" align="center" pt="5" flexWrap="wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <Stack
                  maxWidth="80%"
                  px="20"
                  margin="auto"
                  padding="0"
                  marginBottom="20px"
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <BsPersonFill
                        fontSize="26px"
                        style={{
                          borderRight: "1px solid grey",
                          paddingRight: "6px",
                        }}
                      />
                    </InputLeftElement>
                    <Input
                      id="email"
                      type="email"
                      backgroundColor="gray.200"
                      fontSize="1rem"
                      rounded="7px"
                      border="none"
                      placeholder="Email Address"
                      {...register("email")}
                    ></Input>
                  </InputGroup>
                </Stack>
                <Stack
                  maxWidth="80%"
                  px="20"
                  margin="auto"
                  padding="0"
                  marginBottom="20px"
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <BsFillLockFill
                        fontSize="26px"
                        style={{
                          borderRight: "1px solid grey",
                          paddingRight: "6px",
                        }}
                      />
                    </InputLeftElement>
                    <Input
                      type="password"
                      backgroundColor="gray.200"
                      rounded="7px"
                      border="none"
                      fontSize="1rem"
                      placeholder="Password"
                      {...register("password")}
                    />
                  </InputGroup>
                </Stack>
                <Stack align="center" pt="4" marginBottom="20px">
                  <Button
                    variantColor="blue"
                    type="submit"
                    border="none"
                    width="80%"
                    isLoading={loading}
                  >
                    Sign in
                  </Button>
                </Stack>{" "}
              </FormControl>
            </form>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};
