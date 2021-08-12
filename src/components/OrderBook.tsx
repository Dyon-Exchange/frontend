import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { OrderBookOrder } from "../index.d";

const OrderBookSide = ({ data }: { data: OrderBookOrder[] }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th style={{ textAlign: "center" }}>Price</Th>
        <Th style={{ textAlign: "center" }}>Volume</Th>
        <Th style={{ textAlign: "center" }}>Total Value</Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map((r) => (
        <Tr>
          <Td style={{ textAlign: "center" }}>
            {(r &&
              new Intl.NumberFormat("en-AU", {
                currency: "AUD",
                style: "currency",
              }).format(r.price)) ||
              "-"}
          </Td>
          <Td style={{ textAlign: "center" }}>{r && r.quantity}</Td>
          <Td style={{ textAlign: "center" }}>
            ${(r && (Number(r.price) * Number(r.quantity)).toFixed(2)) || "-"}
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

const OrderBook = ({ orders }: { orders: OrderBookOrder[] }) => {
  return (
    <Stack isInline spacing={8}>
      <Stack>
        <Heading size="sm">Buyers</Heading>
        <OrderBookSide
          data={orders
            .filter((el: OrderBookOrder) => el.side === "sell")
            .sort(
              (a, b) =>
                Number(b.price) * Number(b.quantity) -
                Number(a.price) * Number(a.quantity)
            )}
        />
      </Stack>
      <Stack>
        <Heading size="sm">Sellers</Heading>
        <OrderBookSide
          data={orders
            .filter((el: OrderBookOrder) => el.side === "buy")
            .sort(
              (a, b) =>
                Number(a.price) * Number(a.quantity) -
                Number(b.price) * Number(b.quantity)
            )}
        />
      </Stack>
    </Stack>
  );
};
export default OrderBook;
