import { Asset } from "../index.d";
const abs = Math.abs;

export const sortRecentlyAdded = (a: Asset, b: Asset) => {
  return a.createdAt < b.createdAt ? 1 : -1;
};

export const sortTopTraded = (a: Asset, b: Asset) => {
  return a.volume < b.volume ? 1 : -1;
};

export const sortTopMovers = (a: Asset, b: Asset) => {
  return abs(a.changePercentage) < abs(b.changePercentage) ? 1 : -1;
};

export const sortAll = (a: Asset, b: Asset) => {
  if (a.name > b.name) return 1;
  return -1;
};
