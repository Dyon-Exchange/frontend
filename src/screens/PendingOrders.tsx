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
import React, { useState, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import orderApi from "../api/order";
import { UserContext } from "../contexts/UserContext";
import { toCurrency } from "../formatting";
import { LimitOrder, Asset, OrderSide } from "../index.d";

const TableRow = ({ order }: { order: LimitOrder }) => {
  const [loading, setLoading] = useState(false);
  const { allAssets, methods } = useContext(UserContext);

  const asset: Asset = allAssets.filter(
    (a) => order.productIdentifier === a.productIdentifier
  )[0];

  const cancelOrder = async () => {
    setLoading(true);
    try {
      await orderApi.cancelOrder(order.orderId);
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
    <Tr>
      <Td
        style={{ textAlign: "center", cursor: "pointer" }}
        onClick={handleRowClick}
      >
        <chakra.img src={asset?.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td
        style={{ cursor: "pointer", textAlign: "center", textJustify: "auto" }}
        onClick={handleRowClick}
      >
        {asset?.name} {asset?.year}
      </Td>
      <Td> {order.filled}</Td>
      <Td>{order.quantity}</Td>
      <Td>{toCurrency(order.price)}</Td>
      <Td>{toCurrency(order.price * order.quantity)}</Td>
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

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const side = query.get("side");
    if (side && ["buy", "sell"].includes(side)) {
      if (side === "buy") {
        setShowOrderSide("BID");
      } else {
        setShowOrderSide("ASK");
      }
    }
  }, [location.search]);

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
                <Th />
                <Th />
                <Th>Filled</Th>
                <Th>Quantity to {showOrderSide === "ASK" ? "sell" : "buy"}</Th>
                <Th>Order Price</Th>
                <Th>Order Total</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((o) => (
                <TableRow order={o} key={o.orderId} />
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
