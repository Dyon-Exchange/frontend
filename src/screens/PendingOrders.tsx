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
  Container,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { toCurrency } from "../helpers/toCurrency";
import orderApi from "../api/order";
import { OrderSide, Asset, LimitOrder } from "../index.d";
import { UserContext } from "../contexts/UserContext";
import { formatDate } from "../helpers/formatDate";

interface TableRowProps {
  order: LimitOrder;
}

const TableRow: React.FC<TableRowProps> = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const { allAssets, methods } = useContext(UserContext);
  const { price, quantity, filled } = order;
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
        <chakra.img
          src={asset?.image}
          style={{
            height: 32,
            width: 32,
            borderRadius: 16,
            padding: 0,
            margin: 0,
          }}
        />
      </Td>
      <Td
        style={{ cursor: "pointer", textAlign: "center", textJustify: "auto" }}
        onClick={handleRowClick}
      >
        {asset?.name} {asset?.year}
      </Td>
      <Td textAlign="center">
        {asset ? formatDate(new Date(asset.createdAt)) : "-"}
      </Td>
      <Td textAlign="center">Limit Order</Td>{" "}
      {/* All orders in this table are limit orders */}
      <Td textAlign="center">{quantity ?? "-"}</Td>
      <Td textAlign="center">{filled.toFixed(0) ?? "-"}</Td>
      <Td textAlign="center">{toCurrency(price) ?? "-"}</Td>
      <Td textAlign="center">{toCurrency(quantity * price)}</Td>
      <Td>
        <Flex justifyContent="center">
          {loading ? (
            <Spinner />
          ) : (
            <IoMdCloseCircle size="20" onClick={cancelOrder} />
          )}
        </Flex>
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
          {orders.length > 0 && (
            <Table variant={"striped"} size={"sm"}>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th textAlign="center">Date</Th>
                  <Th textAlign="center">Type</Th>
                  <Th textAlign="center">Volume</Th>
                  <Th textAlign="center">Filled</Th>
                  <Th textAlign="center">Price</Th>
                  <Th textAlign="center">Order Total</Th>
                  <Th textAlign="center">Cancel Order</Th>
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
    </Container>
  );
};

export default PendingOrders;
