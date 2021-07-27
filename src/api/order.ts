import { LimitOrder, MarketOrder, OrderSide } from "../index.d";
import instance from "./instance";

const orders = {
  /**
   * Get all of a user's orders
   * */
  get: async function (): Promise<{
    limitOrders: LimitOrder[];
    marketOrders: MarketOrder[];
  }> {
    const response = await instance.get("/order/user");
    return response.data;
  },
  /**
   * Add a limit order to the orderbook
   */
  putLimitOrder: async function (order: {
    quantity: number;
    side: OrderSide;
    productIdentifier: string;
    price: number;
  }): Promise<LimitOrder> {
    const response = await instance.put("/order/limitOrder", order);
    return response.data;
  },
  /**
   * Add a market order to the orderbook
   */
  putMarketOrder: async function (order: {
    quantity: number;
    side: OrderSide;
    productIdentifier: string;
  }): Promise<MarketOrder> {
    const response = await instance.put("/order/marketOrder", order);
    return response.data;
  },
  /**
   * Cancel the order with the supplied orderId
   */
  cancelOrder: async function (orderId: string): Promise<void> {
    const response = await instance.post("/order/cancelOrder", { orderId });
    return response.data;
  },
  /**
   * Get the market price for the supplied asset, quantity and order side
   */
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
