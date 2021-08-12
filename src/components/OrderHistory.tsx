import React from "react";
import { MarketOrder, LimitOrder } from "../index.d";

const OrderHistory = ({ orders }: { orders: MarketOrder | LimitOrder }) => {
    return (
                        <Heading size="sm" paddingBottom="1%" marginTop="30px">
                  Limit Orders
                </Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th style={{ textAlign: "center" }}>Date</Th>
                      <Th style={{ textAlign: "center" }}>Side</Th>
                      <Th style={{ textAlign: "center" }}>Price</Th>
                      <Th style={{ textAlign: "center" }}>Quantity</Th>
                      <Th style={{ textAlign: "center" }}>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userLimitOrders
                      .filter(
                        (el) =>
                          el.status !== "COMPLETE" && el.status !== "CANCELED"
                      )
                      .sort(
                        (a, b) =>
                          Number(a.price) * Number(a.quantity) -
                          Number(b.price) * Number(b.quantity)
                      )
                      .map((el) => (
                        <Tr>
                          <Td style={{ textAlign: "center" }}>
                            {el && new Date(el.createdAt).toLocaleDateString()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.side.toUpperCase()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {(el &&
                              new Intl.NumberFormat("en-AU", {
                                currency: "AUD",
                                style: "currency",
                              }).format(el.price)) ||
                              "-"}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.quantity}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            $
                            {(el &&
                              (Number(el.price) * Number(el.quantity)).toFixed(
                                2
                              )) ||
                              "-"}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
    )
};

export default OrderHistory;
