import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Routes from "./Routes";
import UserContextProvider from "./contexts/UserContext";

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  </ChakraProvider>
);
