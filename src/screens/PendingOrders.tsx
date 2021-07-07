import React, { useState, useContext, useEffect } from "react";
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import orderApi from "../api/order";
import { OrderSide, Asset, LimitOrder } from "../index.d";
import { UserContext } from "../contexts/UserContext";

const TableRow = (props: { order: LimitOrder }) => {
  const [loading, setLoading] = useState(false);
  const { allAssets, methods } = useContext(UserContext);

  const asset: Asset = allAssets.filter(
    (a) => props.order.productIdentifier === a.productIdentifier
  )[0];

  const cancelOrder = async () => {
    setLoading(true);
    try {
      await orderApi.cancelOrder(props.order.orderId);
      methods.refreshUserOrders();
    } catch (e) {
      window.alert("There was an error canceling your order");
    } finally {
      setLoading(false);
    }
  };

  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${asset.productIdentifier}`);
  };

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <Td style={{ textAlign: "center" }}>
        <chakra.img src={asset?.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {asset?.name} {asset?.year}
      </Td>
      <Td> {props.order.filled}</Td>
      <Td>{props.order.quantity}</Td>
      <Td>${props.order.price}</Td>
      <Td>${(props.order.price * props.order.quantity).toFixed(2)}</Td>
      <Td>
        <Button onClick={cancelOrder} isLoading={loading}>
          Cancel Order
        </Button>
      </Td>
    </Tr>
  );
};

const PendingOrders = () => {
  const [showOrderSide, setShowOrderSide] = useState<OrderSide>("BID");
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const { userLimitOrders } = useContext(UserContext);

  useEffect(() => {
    setOrders(
      userLimitOrders.filter(
        (o) => o.side === showOrderSide && o.status === "PENDING"
      )
    );
  }, [showOrderSide, userLimitOrders]);

  return (
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
        {orders.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th>Filled</Th>
                <Th>Quantity to {showOrderSide === "ASK" ? "sell" : "buy"}</Th>
                <Th>Order Price</Th>
                <Th>Order Total</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((o, i) => (
                <TableRow order={o} key={i} />
              ))}
            </Tbody>
          </Table>
        )}
        {orders.length === 0 && (
          <Heading size="md">
            You have no pending {showOrderSide === "ASK" ? "sell" : "buy"}{" "}
            orders
          </Heading>
        )}
      </Box>
    </VStack>
  );
};

export default PendingOrders;
