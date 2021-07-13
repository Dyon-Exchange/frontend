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
import { toCurrency } from "../formatting";
import { UserContext } from "../contexts/UserContext";
import orderApi from "../api/order";

const Trade = (props: {
  productIdentifier: string;
  askMarketPrice: number;
  bidMarketPrice: number;
  assetName: string;
}) => {
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [amount, setAmount] = useState<number>(1);
  const [stepperValue, setStepperValue] = useState(0);
  const [total, setTotal] = useState(stepperValue * amount);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "pending" | "error" | "submitted"
  >("pending");
  const [error, setError] = useState("");
  const [submittedText, setSubmittedText] = useState(
    "Your order has been submitted"
  );

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { methods } = useContext(UserContext);

  const doClose = () => {
    setOrderStatus("pending");
    setError("");
    onClose();
  };

  useEffect(() => {
    if (orderSide === "SELL") {
      setStepperValue(props.askMarketPrice);
    } else {
      setStepperValue(props.bidMarketPrice);
    }
  }, [props.askMarketPrice, props.bidMarketPrice, orderSide]);

  useEffect(() => {
    const marketPrice =
      orderSide === "SELL" ? props.askMarketPrice : props.bidMarketPrice;

    if (stepperValue === marketPrice) {
      setOrderType("MARKET");
    } else {
      setOrderType("LIMIT");
    }
  }, [stepperValue, props.askMarketPrice, props.bidMarketPrice, orderSide]);

  useEffect(() => {
    let total = stepperValue * amount;
    if (Number.isNaN(total)) {
      total = 0;
    }
    setTotal(total);
  }, [stepperValue, amount]);

  const submitOrder = async () => {
    setLoading(true);
    try {
      if (orderType === "LIMIT") {
        await orderApi.putLimitOrder({
          price: stepperValue,
          quantity: amount,
          side: orderSide === "BUY" ? "BID" : "ASK",
          productIdentifier: props.productIdentifier,
        });
        setOrderStatus("submitted");
        setSubmittedText("Your order has been submitted");
      } else {
        const order = await orderApi.putMarketOrder({
          quantity: amount,
          side: orderSide === "BUY" ? "BID" : "ASK",
          productIdentifier: props.productIdentifier,
        });
        if (order.status === "NOT-FILLED") {
          setOrderStatus("error");
          setSubmittedText(
            "There is not enough liquidity to complete your order"
          );
        } else {
          setOrderStatus("submitted");
          setSubmittedText(
            `Your order was completed. ${order.filled}/${amount}`
          );
        }
      }
    } catch (e) {
      window.alert("Error: There was an error processing your order");
      setError(e.response.text);
    } finally {
      methods.refreshUserOrders();
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
          onClick={() => setOrderSide("BUY")}
          bgColor={orderSide === "BUY" ? "black" : undefined}
          textColor={orderSide === "BUY" ? "white" : undefined}
          _hover={{
            bgColor: "black",
            textColor: "white",
          }}
        >
          Buy
        </Button>
        <Button
          bgColor={orderSide === "SELL" ? "black" : undefined}
          textColor={orderSide === "SELL" ? "white" : undefined}
          _hover={{
            bgColor: "black",
            textColor: "white",
          }}
          width="100%"
          onClick={() => setOrderSide("SELL")}
        >
          Sell
        </Button>
      </HStack>
      <Text py="2" style={{ fontWeight: "bold", fontSize: 16 }}>
        What price?
      </Text>
      <HStack py="2" justifyContent="space-between">
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Market price</Text>
        <Button
          onClick={() =>
            setStepperValue(
              orderSide === "BUY" ? props.bidMarketPrice : props.askMarketPrice
            )
          }
        >
          <Text style={{ fontSize: 16 }}>
            US{" "}
            {orderSide === "BUY"
              ? toCurrency(props.bidMarketPrice)
              : toCurrency(props.askMarketPrice)}
          </Text>
        </Button>
      </HStack>
      <HStack py="2" justifyContent="space-between">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Not {orderSide === "BUY" ? "More" : "Less"} than
        </Text>
        <NumberInput
          width="40%"
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
          {toCurrency(total)}
        </Text>
      </HStack>
      <Stack>
        <Button
          py="7"
          my="3"
          style={{ justifySelf: "center" }}
          onClick={onOpen}
        >
          Review {orderType === "MARKET" ? "market" : "limit"} order
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
                {orderSide} {amount} {props.assetName} at ${stepperValue} for $
                {total}
              </Text>
            )}
            {orderStatus === "error" && (
              <Text style={{ textAlign: "center" }}>
                There was an error with your order: {{ error }}
              </Text>
            )}
            {orderStatus === "submitted" && (
              <Text style={{ textAlign: "center" }}>{submittedText}</Text>
            )}
          </ModalBody>
          <ModalFooter style={{ justifyContent: "center" }}>
            {orderStatus === "pending" && (
              <Button onClick={submitOrder} isLoading={loading}>
                Confirm
              </Button>
            )}
            {/* orderStatus === "submitted" && <Button>View</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default Trade;
