// Types/Interfaces representing domain models from database

type OrderStatus = "PENDING" | "COMPLETE" | "CANCELED" | "NOT-FILLED";
type OrderSide = "BID" | "ASK";

interface Order {
  status: OrderStatus;
  productIdentifier: string;
  filled: number;
  quantity: number;
  side: OrderSide;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LimitOrder extends Order {
  price: number;
}

export interface MarketOrder extends Order {
  price?: number;
}

export type Asset = {
  productIdentifier: string;
  year: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  askMarketPrice?: number;
  bidMarketPrice?: number;
  unitSize: string;
  details: { blurb: string };
  volume: number;
  marketCap: number;
  changePercentage: number;
  changeAmount: number;
};

export type Token = {
  productCode: string;
  caseId: string;
  locationId: string;
  taxCode: string;
  conditionCode: string;
  tokenId: string;
  productIdentifier: string;
};

export type UserAsset = {
  quantity: number;
  asset: Asset;
  portfolioShare: number;
};

export type PriceEvent = {
  time: Date;
  price: number;
  productIdentifier: string;
};
