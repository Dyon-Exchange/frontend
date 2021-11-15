import { ChakraProvider, theme } from "@chakra-ui/react";
import React from "react";

import { UserContextProvider } from "./contexts/UserContext";
import Routes from "./Routes";

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  </ChakraProvider>
);
