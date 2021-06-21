import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Stack,
  HStack,
  InputGroup,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { UserContext } from "../contexts/UserContext";
import orderApi from "../api/order";

const Trade = (props: {
  productIdentifier: string;
  marketPrice: number;
  assetName: string;
}) => {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<number>(1);
  const [stepperValue, setStepperValue] = useState(0);
  const [total, setTotal] = useState(stepperValue * amount);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "pending" | "error" | "submitted"
  >("pending");
  const [error, setError] = useState("");

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { methods } = useContext(UserContext);

  const doClose = () => {
    setOrderStatus("pending");
    setError("");
    onClose();
  };

  useEffect(() => {
    setStepperValue(props.marketPrice);
  }, [props.marketPrice]);

  useEffect(() => {
    let total = stepperValue * amount;
    if (Number.isNaN(total)) {
      total = 0;
    }
    setTotal(total);
  }, [stepperValue, amount]);

  const submitLimitOrder = async () => {
    setLoading(true);
    try {
      await orderApi.putLimitOrder({
        price: stepperValue,
        quantity: amount,
        side: orderType === "BUY" ? "BID" : "ASK",
        productIdentifier: props.productIdentifier,
      });
      setOrderStatus("submitted");
      methods.refreshUserOrders();
    } catch (e) {
      window.alert("Error: There was an error processing your order");
      setError(e.response.text);
    } finally {
      setLoading(false);
    }
  };

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
        <Button onClick={() => setStepperValue(props.marketPrice)}>
          <Text style={{ fontSize: 16 }}>US $ {props.marketPrice}</Text>
        </Button>
      </HStack>
      <HStack py="2" justifyContent="space-between">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Not {orderType === "BUY" ? "More" : "Less"} than
        </Text>
        <NumberInput
          width="35%"
          value={stepperValue}
          onChange={(e) => setStepperValue(parseFloat(e))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>

      <Text style={{ fontSize: 16, fontWeight: "bold" }} py="2">
        How many units?
      </Text>
      <InputGroup>
        <Input
          type="number"
          rounded="7px"
          borderColor="grey"
          fontSize="1rem"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </InputGroup>
      <HStack py="4" justifyContent="space-between">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Total: </Text>
        <Text px="3" style={{ fontSize: 16 }}>
          ${total}
        </Text>
      </HStack>
      <Stack>
        <Button
          py="7"
          my="3"
          style={{ justifySelf: "center" }}
          onClick={onOpen}
        >
          Review order
        </Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={doClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ textAlign: "center" }}>
            Review Order
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orderStatus === "pending" && (
              <Text style={{ textAlign: "center" }}>
                {orderType} {amount} {props.assetName} at ${stepperValue} for $
                {total}
              </Text>
            )}

            {orderStatus === "error" && (
              <Text style={{ textAlign: "center" }}>
                There was an error with your order: {{ error }}
              </Text>
            )}

            {orderStatus === "submitted" && (
              <Text style={{ textAlign: "center" }}>
                Your order has been submitted
              </Text>
            )}
          </ModalBody>
          <ModalFooter style={{ justifyContent: "center" }}>
            {orderStatus === "pending" && (
              <Button onClick={submitLimitOrder} isLoading={loading}>
                Confirm
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default Trade;
