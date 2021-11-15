import { Asset, UserAsset } from "../index.d";

import instance from "./instance";

const assetApi = {
  get: async (): Promise<Asset[]> => {
    const { data } = await instance.get("/asset/");
    return data.assets;
  },
  getAssetData: async (
    productIdentifier: string
  ): Promise<{ asset: Asset; priceEvents: any }> => {
    const { data } = await instance.get(`/asset/data/${productIdentifier}`);
    return data;
  },
  getUserAssets: async (): Promise<{
    assets: UserAsset[];
    portfolioBalance: number;
  }> => {
    const { data } = await instance.get("/asset/user");
    return data;
  },
  image: async (productIdentifier: string, formData: any) => {
    const { data } = await instance.put(
      `/asset/image/${productIdentifier}`,
      formData
    );
    return data;
  },
};

export default assetApi;
