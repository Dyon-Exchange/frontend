import { LimitOrder, MarketOrder, OrderSide } from "../index.d";
import instance from "./instance";

const orders = {
  get: async function (): Promise<{
    limitOrders: LimitOrder[];
    marketOrders: MarketOrder[];
  }> {
    const response = await instance.get("/order/user");
    return response.data;
  },
  putLimitOrder: async function (order: {
    quantity: number;
    side: OrderSide;
    productIdentifier: string;
    price: number;
  }): Promise<void> {
    const response = await instance.put("/order/limitOrder", order);
    return response.data;
  },
  cancelOrder: async function (orderId: string): Promise<void> {
    const response = await instance.post("/order/cancelOrder", { orderId });
    return response.data;
  },
  marketPrice: async function (
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
