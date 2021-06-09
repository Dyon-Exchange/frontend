import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Stack,
  HStack,
  InputGroup,
  Select,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

const Trade = (props: { productIdentifier: string; marketPrice: number }) => {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState(0);
  const [stepperValue, setStepperValue] = useState(0);

  useEffect(() => {
    setStepperValue(props.marketPrice);
  }, [props.marketPrice]);

  return (
    <Box>
      <Heading py="2" size="md">
        Make a trade
      </Heading>
      <Heading py="2" size="sm">
        Choose an order type
      </Heading>
      <HStack width="100%">
        <Button
          width="100%"
          onClick={() => setOrderType("BUY")}
          bgColor={orderType === "BUY" ? "black" : undefined}
          textColor={orderType === "BUY" ? "white" : undefined}
          _hover={{
            bgColor: "black",
            textColor: "white",
          }}
        >
          Buy
        </Button>
        <Button
          bgColor={orderType === "SELL" ? "black" : undefined}
          textColor={orderType === "SELL" ? "white" : undefined}
          _hover={{
            bgColor: "black",
            textColor: "white",
          }}
          width="100%"
          onClick={() => setOrderType("SELL")}
        >
          Sell
        </Button>
      </HStack>
      <Text py="2" style={{ fontWeight: "bold", fontSize: 16 }}>
        What price?
      </Text>
      <HStack py="2" justifyContent="space-between">
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Market price</Text>
        <Text style={{ fontSize: 16 }}>US$ {props.marketPrice}</Text>
      </HStack>
      <HStack py="2" justifyContent="space-between">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Not {orderType === "BUY" ? "Less" : "More"} than
        </Text>
        <NumberInput
          width="35%"
          value={stepperValue}
          onChange={(e) => setStepperValue(Number(e))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>

      <Text style={{ fontSize: 16, fontWeight: "bold" }} py="2">
        How much?
      </Text>
      <InputGroup>
        <InputLeftElement>
          <Text>$</Text>
        </InputLeftElement>
        <Input
          type="number"
          rounded="7px"
          border="none"
          borderColor="grey"
          fontSize="1rem"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <InputRightElement>
          <Text>USD</Text>
        </InputRightElement>
      </InputGroup>
      <HStack py="5" justifyContent="space-between">
        <Button onClick={() => setAmount(50)} width="100%">
          $50
        </Button>
        <Button onClick={() => setAmount(100)} width="100%">
          $100
        </Button>
        <Button onClick={() => setAmount(500)} width="100%">
          $500
        </Button>
        <Button onClick={() => setAmount(1000)} width="100%">
          $1000
        </Button>
      </HStack>
      <Stack>
        <Button py="7" my="3" style={{ justifySelf: "center" }}>
          Review order
        </Button>
      </Stack>
    </Box>
  );
};
export default Trade;
