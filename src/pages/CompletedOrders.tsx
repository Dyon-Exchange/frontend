import React, { useContext, useState, useEffect } from "react";
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout";
import { LimitOrder, MarketOrder } from "../index.d";
import { UserContext } from "../contexts/UserContext";
import { sortOrdersRecentlyUpdated } from "../helpers/sorting";
import OrderTable from "../components/common/OrderTable";

const CompletedOrders = function () {
  const { userLimitOrders, userMarketOrders } = useContext(UserContext);
  const [orders, setOrders] = useState<(LimitOrder | MarketOrder)[]>([]);

  useEffect(() => {
    const limitOrders = userLimitOrders.filter((o) => o.status === "COMPLETE");
    const marketOrders = userMarketOrders.filter(
      (o) => o.status === "COMPLETE"
    );
    const all = [...limitOrders, ...marketOrders];
    all.sort(sortOrdersRecentlyUpdated);
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
        {orders.length > 0 && <OrderTable type="completed" orders={orders} />}
        {orders.length === 0 && (
          <Heading size="md">You have no completed orders</Heading>
        )}
      </Box>
    </VStack>
  );
};

export default CompletedOrders;
