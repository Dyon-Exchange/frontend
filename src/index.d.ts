// Types/Interfaces representing domain models from database

type OrderStatus = "PENDING" | "COMPLETE" | "CANCELED" | "NOT-FILLED";
type OrderSide = "BID" | "ASK";

export type OrderBookOrder = {
  side: "buy" | "sell";
  id: string;
  timestamp: Date;
  quantity: number;
  price: number;
};

export type GetOrdersResponse = {
  buy: OrderBookOrder[];
  sell: OrderBookOrder[];
  error?: string;
};

interface Order {
  status: OrderStatus;
  productIdentifier: string;
  filled: number;
  quantity: number;
  side: OrderSide;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  filledPriceTotal: number;
  filledPriceAverage: number;
}

export interface LimitOrder extends Order {
  price: number;
}

export interface MarketOrder extends Order {
  price?: number;
}

export type PriceEvent = {
  time: Date;
  price: number;
  productIdentifier: string;
};

export type Asset = {
  productIdentifier: string;
  year: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  askMarketPrice?: number;
  bidMarketPrice?: number;
  buy?: number;
  sell?: number;
  unitSize: string;
  details: { blurb: string };
  volume: number;
  marketCap: number;
  changePercentage: number;
  changeAmount: number;
  // Can be  added on front end on market page
  lastPriceAction?: number;
};

export interface AssetDetails {
  asset: Asset;
  priceEvents: Array<PriceEvent>;
}

export type Token = {
  productCode: string;
  caseId: string;
  locationId: string;
  taxCode: string;
  conditionCode: string;
  tokenId: string;
  productIdentifier: string;
};

export interface UserAsset {
  quantity: number;
  asset: Asset;
  portfolioShare: number;
}
