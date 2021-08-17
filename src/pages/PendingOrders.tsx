import React, { useState, useContext, useEffect } from "react";
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import { Button, Container } from "@chakra-ui/react";
import { OrderSide, LimitOrder } from "..";
import { UserContext } from "../contexts/UserContext";
import OrderTable from "../components/common/OrderTable";
import { useLocation } from "react-router-dom";

const PendingOrders = () => {
  const [showOrderSide, setShowOrderSide] = useState<OrderSide>("BID");
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const { userLimitOrders } = useContext(UserContext);

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const side = query.get("side");
    if (side && ["buy", "sell"].includes(side)) {
      side === "buy" ? setShowOrderSide("BID") : setShowOrderSide("ASK");
    }
  }, [location.search]);

  useEffect(() => {
    setOrders(
      userLimitOrders.filter(
        (o) => o.side === showOrderSide && o.status === "PENDING"
      )
    );
  }, [showOrderSide, userLimitOrders]);

  console.log("user limit orders:");
  console.log(orders);

  return (
    <Container maxW="container.xl">
      <VStack py="5%" width="100%">
        <HStack width="100%" justifyContent="space-between" px="20%">
          <Heading>Pending Orders</Heading>
          <HStack>
            <Button
              bgColor={showOrderSide === "BID" ? "black" : undefined}
              textColor={showOrderSide === "BID" ? "white" : undefined}
              _hover={{
                bgColor: "black",
                textColor: "white",
              }}
              onClick={() => setShowOrderSide("BID")}
            >
              Buy Orders
            </Button>
            <Button
              bgColor={showOrderSide === "ASK" ? "black" : undefined}
              textColor={showOrderSide === "ASK" ? "white" : undefined}
              _hover={{
                bgColor: "black",
                textColor: "white",
              }}
              onClick={() => setShowOrderSide("ASK")}
            >
              Sell Orders
            </Button>
          </HStack>
        </HStack>

        <Box py="5%">
          {orders.length > 0 && <OrderTable orders={orders} />}
          {orders.length === 0 && (
            <Heading size="md">
              You have no pending {showOrderSide === "ASK" ? "sell" : "buy"}{" "}
              orders
            </Heading>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default PendingOrders;
