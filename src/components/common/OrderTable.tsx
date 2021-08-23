import {
  Thead,
  Tr,
  Th,
  Tbody,
  chakra,
  Flex,
  Spinner,
  Td,
} from "@chakra-ui/react";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { LimitOrder, Asset, MarketOrder } from "../../index.d";
import { toCurrency } from "../../formatting";
import { formatDate } from "../../helpers/formatDate";
import orderApi from "../../api/order";
import BaseTable from "./BaseTable";
import { filter, map } from "lodash";
import assetApi from "../../api/asset";
import { UserContext } from "../../contexts/UserContext";

type OrderStatus = "completed" | "pending";

interface RowData {
  asset: Asset;
  order: LimitOrder & MarketOrder;
}

interface TableRowProps {
  data: RowData;
  type: OrderStatus;
}

const TableRow: FC<TableRowProps> = ({ data, type }) => {
  const [loading, setLoading] = useState(false);
  const { order, asset } = data;
  const {
    price,
    quantity,
    status,
    filled,
    updatedAt,
    filledPriceAverage,
    filledPriceTotal,
  } = order;
  const { methods } = useContext(UserContext);

  /**
   * In case of future programmer error, if orders are completed and the button is rendered,
   * function is set to return void
   *
   */
  const cancelOrder =
    order.status === "COMPLETE"
      ? () => {
          return;
        }
      : async () => {
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
    history.push(`/asset/${asset?.productIdentifier}`);
  };

  const renderPrice = (() => {
    if (status !== "CANCELED") {
      return filledPriceAverage === 0 ? filledPriceTotal : filledPriceAverage;
    }
    return price;
  })();

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
      {/* All orders in this table are limit orders */}
      <Td textAlign="center">Limit Order</Td> {/* TODO this needs to change */}
      <Td textAlign="center">{quantity ?? "-"}</Td>
      <Td textAlign="center">{filled.toFixed(2) ?? "-"}</Td>
      <Td textAlign="center">{renderPrice ? toCurrency(renderPrice) : "-"}</Td>
      <Td textAlign="center">
        {renderPrice ? toCurrency(filled * renderPrice) : "-"}
      </Td>
      {type === "pending" && (
        <Td>
          <Flex justifyContent="center">
            {loading ? (
              <Spinner />
            ) : (
              <IoMdCloseCircle size="20" onClick={cancelOrder} />
            )}
          </Flex>
        </Td>
      )}
      {type === "completed" && (
        <Td textAlign="center">{formatDate(new Date(updatedAt))}</Td>
      )}
    </Tr>
  );
};

interface OrderTableProps {
  orders: Array<LimitOrder & MarketOrder>;
  type: OrderStatus;
}

const OrderTable: FC<OrderTableProps> = ({ orders, type }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  useEffect(() => {
    const prodIds = map(orders, (order) => order.productIdentifier);
    const getAssets = async () => {
      const assets = await assetApi.getMany(prodIds);
      setAssets([...assets]);
    };
    getAssets();
  }, [orders]);

  // If refactoring be careful - map over orders as they may be for the same asset
  const rowData: RowData[] = useMemo(() => {
    if (!assets) return [];
    let rows: RowData[] = [];
    orders.forEach((order) => {
      const asset = filter(
        assets,
        (asset) => order.productIdentifier === asset.productIdentifier
      )[0];
      rows.push({ asset, order });
    });
    return rows;
  }, [assets, orders]);

  return (
    <BaseTable>
      <Thead>
        <Tr>
          <Th></Th>
          <Th></Th>
          <Th textAlign="center">Date</Th>
          <Th textAlign="center">Type</Th>
          <Th textAlign="center">Volume</Th>
          <Th textAlign="center">Filled</Th>
          <Th textAlign="center">
            {type === "completed" ? "Avg. Price" : "Price"}
          </Th>
          <Th textAlign="center">Order Total</Th>
          {type === "pending" && <Th textAlign="center">Cancel Order</Th>}
          {type === "completed" && <Th textAlign="center">Settle Date</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {rowData.map((row, i) => (
          <TableRow
            type={type}
            data={row}
            key={`${row.order.productIdentifier}${i}`}
          />
        ))}
      </Tbody>
    </BaseTable>
  );
};

export default OrderTable;
