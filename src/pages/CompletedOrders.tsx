import React, { useContext, useState, useEffect } from "react";
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { LimitOrder, Asset, MarketOrder } from "../index.d";
import { toCurrency } from "../formatting";
import { UserContext } from "../contexts/UserContext";

const TableRow = (props: { order: LimitOrder | MarketOrder }) => {
  const { allAssets } = useContext(UserContext);

  const asset: Asset = allAssets.filter(
    (a) => props.order.productIdentifier === a.productIdentifier
  )[0];

  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${asset.productIdentifier}`);
  };

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <Td>{new Date(props.order.createdAt).toLocaleDateString()}</Td>
      <Td>{props.order.side}</Td>
      <Td>
        {props.order.quantity} {asset?.name} {asset?.year}
      </Td>
      <Td>{toCurrency(props.order?.filledPriceAverage as number)}</Td>
      <Td>
        {props.order.filledPriceTotal &&
          toCurrency(props.order.filledPriceTotal)}
      </Td>
      <Td>{new Date(props.order.updatedAt).toLocaleDateString()}</Td>
    </Tr>
  );
};

const CompletedOrders = function () {
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
      } else {
        return -1;
      }
    });
    setOrders(all);
  }, [userLimitOrders, userMarketOrders]);

  console.log("orders:");
  console.log(orders);

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
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Volume</Th>
                <Th>Avg. Price</Th>
                <Th>Value</Th>
                <Th>Settle date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((o: MarketOrder | LimitOrder, i: number) => (
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
