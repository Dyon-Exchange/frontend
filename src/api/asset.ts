import { Asset, AssetDetails, UserAsset } from "../index.d";
import instance from "./instance";

const assetApi = {
  /**
   * Get all assets
   */
  get: async (): Promise<Asset[]> => {
    const { data } = await instance.get("/asset/");
    return data.assets;
  },
  /**
      Get data for one asset
   */
  getAssetData: async (productIdentifier: string): Promise<AssetDetails> => {
    const { data } = await instance.get(`/asset/data/${productIdentifier}`);
    return data;
  },
  /**
   * Get data for user's owned assets
   */
  getUserAssets: async (): Promise<{
    assets: UserAsset[];
    portfolioBalance: number;
  }> => {
    const { data } = await instance.get("/asset/user");
    return data;
  },

  /*
   * Add an image for the asset
   */
  image: async (productIdentifier: string, formData: any) => {
    const { data } = await instance.put(
      `/asset/image/${productIdentifier}`,
      formData
    );
    return data;
  },
};
export default assetApi;
