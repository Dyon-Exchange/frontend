import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { toCurrency } from "../formatting";
import { LimitOrder, MarketOrder } from "../index.d";

/**
 * Row for completed orders component
 */
const TableRow = ({ order }: { order: LimitOrder | MarketOrder }) => {
  const { allAssets } = useContext(UserContext);

  const asset = allAssets.find(
    (a) => order.productIdentifier === a.productIdentifier
  );

  const history = useHistory();

  if (!asset) return null;

  return (
    <Tr
      onClick={() => history.push(`/asset/${asset.productIdentifier}`)}
      style={{ cursor: "pointer" }}
    >
      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
      <Td>{new Date(order.updatedAt).toLocaleDateString()}</Td>
      <Td>{order.side}</Td>
      <Td>{toCurrency(order?.price as number)}</Td>
      <Td>{order.price && toCurrency(order?.price * order.filled)}</Td>
      <Td>
        {order.quantity} {asset?.name} {asset?.year}
      </Td>
      <Td />
    </Tr>
  );
};

const CompletedOrders = () => {
  const { userLimitOrders, userMarketOrders } = useContext(UserContext);
  const [orders, setOrders] = useState<(LimitOrder | MarketOrder)[]>([]);

  useEffect(() => {
    const limitOrders = userLimitOrders.filter((o) => o.status === "COMPLETE");
    const marketOrders = userMarketOrders.filter(
      (o) => o.status === "COMPLETE"
    );
    const all = [...limitOrders, ...marketOrders];
    all.sort((a: MarketOrder | LimitOrder, b: MarketOrder | LimitOrder) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return -1;
    });
    setOrders(all);
  }, [userLimitOrders, userMarketOrders]);

  return (
    <VStack py="5%" width="100%">
      <HStack width="100%" justifyContent="space-between" px="20%">
        <Heading>Completed Orders</Heading>
      </HStack>

      <Box py="5%" px="10%">
        {orders.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                <Th>Created</Th>
                <Th>Completed</Th>
                <Th>Side</Th>
                <Th>Price</Th>
                <Th>Total</Th>
                <Th>Amount</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((o: MarketOrder | LimitOrder) => (
                <TableRow order={o} key={o.orderId} />
              ))}
            </Tbody>
          </Table>
        )}
        {orders.length === 0 && (
          <Heading size="md">You have no completed orders</Heading>
        )}
      </Box>
    </VStack>
  );
};

export default CompletedOrders;
