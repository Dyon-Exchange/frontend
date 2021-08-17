import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  chakra,
  Flex,
  Spinner,
  Td,
} from "@chakra-ui/react";
import React, { FC, useContext, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { LimitOrder, Asset } from "../../index.d";
import { UserContext } from "../../contexts/UserContext";
import { toCurrency } from "../../formatting";
import { formatDate } from "../../helpers/formatDate";
import orderApi from "../../api/order";

interface TableRowProps {
  order: LimitOrder;
}

const TableRow: FC<TableRowProps> = ({ order }) => {
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

interface OrderTableProps {
  orders: Array<LimitOrder>;
}

const OrderTable: FC<OrderTableProps> = ({ orders }) => (
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
);

export default OrderTable;
