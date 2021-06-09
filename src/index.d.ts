export type Asset = {
  productIdentifier: string;
  year: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  marketPrice?: number;
  unitSize: string;
  details: { blurb: string };
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
