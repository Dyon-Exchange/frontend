import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Routes from "./Routes";
import UserContextProvider from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient: QueryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </ChakraProvider>
  </QueryClientProvider>
);
