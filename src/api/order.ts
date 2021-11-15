import { LimitOrder, MarketOrder, OrderSide } from "../index.d";

import instance from "./instance";

const orders = {
  async get(): Promise<{
    limitOrders: LimitOrder[];
    marketOrders: MarketOrder[];
  }> {
    const response = await instance.get("/order/user");
    return response.data;
  },
  async putLimitOrder(order: {
    quantity: number;
    side: OrderSide;
    productIdentifier: string;
    price: number;
  }): Promise<LimitOrder> {
    const response = await instance.put("/order/limitOrder", order);
    return response.data;
  },
  async putMarketOrder(order: {
    quantity: number;
    side: OrderSide;
    productIdentifier: string;
  }): Promise<MarketOrder> {
    const response = await instance.put("/order/marketOrder", order);
    return response.data;
  },
  async cancelOrder(orderId: string): Promise<void> {
    const response = await instance.post("/order/cancelOrder", { orderId });
    return response.data;
  },
  async marketPrice(
    productIdentifier: string,
    quantity: number,
    side: OrderSide
  ): Promise<number> {
    const response = await instance.post("/order/calculateMarketPrice", {
      productIdentifier,
      quantity,
      side,
    });
    return response.data.price;
  },
};

export default orders;
