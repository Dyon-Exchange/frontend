export type Asset = {
  productIdentifier: string;
  year: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
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
