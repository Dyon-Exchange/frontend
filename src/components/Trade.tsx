import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  HStack,
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
import { useHistory } from "react-router-dom";
import { toCurrency } from "../formatting";
import { UserContext } from "../contexts/UserContext";
import orderApi from "../api/order";

const Trade = (props: {
  productIdentifier: string;
  askMarketPrice: number;
  bidMarketPrice: number;
  assetName: string;
}) => {
  const history = useHistory();
  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [amount, setAmount] = useState("1.00");
  const [stepperValue, setStepperValue] = useState("0.00");
  const [total, setTotal] = useState(
    parseFloat(stepperValue) * parseFloat(amount)
  );
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "Pending" | "Error" | "Submitted" | "Completed"
  >("Pending");
  const [error, setError] = useState("");
  const [submittedText, setSubmittedText] = useState(
    "Your order has been submitted"
  );

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { methods } = useContext(UserContext);

  const doClose = () => {
    setOrderStatus("Pending");
    setError("");
    onClose();
  };

  const viewClick = () => {
    if (orderStatus === "Submitted") {
      history.push(`/pendingorders?side=${orderSide.toLowerCase()}`);
    } else if (orderStatus === "Completed") {
      history.push("/completedorders");
    } else {
      throw new Error(
        "Should not be able to click view if status is not `Submitted` or `Completed`"
      );
    }
  };

  useEffect(() => {
    if (orderSide === "SELL") {
      if (props.askMarketPrice) {
        setStepperValue(props.askMarketPrice.toString());
      }
    } else {
      if (props.bidMarketPrice) {
        setStepperValue(props.bidMarketPrice.toString());
      }
    }
  }, [props.askMarketPrice, props.bidMarketPrice, orderSide]);

  useEffect(() => {
    const marketPrice =
      orderSide === "SELL" ? props.askMarketPrice : props.bidMarketPrice;

    if (parseFloat(stepperValue) === marketPrice) {
      setOrderType("MARKET");
    } else {
      setOrderType("LIMIT");
    }
  }, [stepperValue, props.askMarketPrice, props.bidMarketPrice, orderSide]);

  useEffect(() => {
    let total = parseFloat(stepperValue) * parseFloat(amount);
    if (Number.isNaN(total)) {
      total = 0;
    }
    setTotal(total);
  }, [stepperValue, amount]);

  const submitOrder = async () => {
    setLoading(true);
    try {
      if (orderType === "LIMIT") {
        const order = await orderApi.putLimitOrder({
          price: parseFloat(stepperValue),
          quantity: parseFloat(amount),
          side: orderSide === "BUY" ? "BID" : "ASK",
          productIdentifier: props.productIdentifier,
        });

        if (order.status === "COMPLETE") {
          setOrderStatus("Completed");
          setSubmittedText("Your order has been completed");
        } else {
          setOrderStatus("Submitted");
          setSubmittedText("Your order has been submitted");
        }
      } else {
        const order = await orderApi.putMarketOrder({
          quantity: parseFloat(amount),
          side: orderSide === "BUY" ? "BID" : "ASK",
          productIdentifier: props.productIdentifier,
        });
        if (order.status === "NOT-FILLED") {
          setOrderStatus("Error");
          setSubmittedText(
            "There is not enough liquidity to complete your order"
          );
        } else {
          setOrderStatus("Completed");
          setSubmittedText(
            `Your order was completed. ${order.filled.toFixed(2)}/${amount}`
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
              orderSide === "BUY"
                ? props.bidMarketPrice.toString()
                : props.askMarketPrice.toString()
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
          precision={2}
          width="40%"
          value={format(stepperValue)}
          onChange={(e) => {
            setStepperValue(parse(e));
          }}
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
      <NumberInput
        precision={2}
        rounded="7px"
        borderColor="grey"
        fontSize="1rem"
        width="100%"
        value={amount}
        onChange={(e) => {
          setAmount(parse(e));
        }}
      >
        <NumberInputField />
      </NumberInput>

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
            {orderStatus === "Pending" && "Review Order"}
            {orderStatus !== "Pending" && orderStatus}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orderStatus === "Pending" && (
              <Text style={{ textAlign: "center" }}>
                {orderSide} {amount} {props.assetName} at ${stepperValue} for $
                {total}
              </Text>
            )}
            {orderStatus === "Error" && (
              <Text style={{ textAlign: "center" }}>
                There was an Error with your order: {{ error }}
              </Text>
            )}
            {(orderStatus === "Completed" || orderStatus === "Submitted") && (
              <Text style={{ textAlign: "center" }}>{submittedText}</Text>
            )}
          </ModalBody>
          <ModalFooter style={{ justifyContent: "center" }}>
            {orderStatus === "Pending" && (
              <Button onClick={submitOrder} isLoading={loading}>
                Confirm
              </Button>
            )}

            {orderStatus !== "Pending" && (
              <>
                <Button onClick={doClose} style={{ margin: "2%" }}>
                  OK
                </Button>
                <Button onClick={viewClick}>View</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default Trade;
