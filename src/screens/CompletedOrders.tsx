import React, { useContext, useState, useEffect } from "react";
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { LimitOrder, Asset } from "../index.d";
import { UserContext } from "../contexts/UserContext";

const TableRow = (props: { order: LimitOrder }) => {
  const { allAssets } = useContext(UserContext);

  const asset: Asset = allAssets.filter(
    (a) => props.order.productIdentifier === a.productIdentifier
  )[0];

  return (
    <Tr>
      <Td>{new Date(props.order.createdAt).toLocaleDateString()}</Td>
      <Td>{new Date(props.order.updatedAt).toLocaleDateString()}</Td>
      <Td>{props.order.side} - Limit</Td>
      <Td>${props.order.price}</Td>
      <Td>{props.order.price * props.order.quantity}</Td>
      <Td>
        {props.order.quantity} {asset.name} {asset.year}
      </Td>
      <Td></Td>
    </Tr>
  );
};

const CompletedOrders = function () {
  const { userOrders } = useContext(UserContext);
  const [orders, setOrders] = useState<LimitOrder[]>([]);

  useEffect(() => {
    setOrders(userOrders.filter((o) => o.status === "COMPLETE"));
  }, [userOrders]);

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
          <Heading size="md">You have no completed orders</Heading>
        )}
      </Box>
    </VStack>
  );
};

export default CompletedOrders;
