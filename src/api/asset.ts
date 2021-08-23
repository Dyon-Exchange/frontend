import { Asset, AssetDetails, UserAsset } from "../index.d";
import instance from "./instance";

interface InfiniteQueryParams {
  pageParam?: number;
  limit: number;
}

const assetApi = {
  /**
   * Get all assets
   * Paginated data
   */
  get: async ({ pageParam = 0, limit = 6 }: any): Promise<any> => {
    // TODO - remove any
    try {
      const { data } = await instance.get("/asset/", {
        params: { limit, start: pageParam },
      });

      return data;
    } catch (err) {
      console.error(err.message);
      throw new Error("Failed to retrieve asset data");
    }
  },
  /**
      Get data for one asset
   */
  getAssetData: async (productIdentifier: string): Promise<AssetDetails> => {
    const { data } = await instance.get(`/asset/data/${productIdentifier}`);
    return data;
  },
  /**
   * Takes an array of product identifiers, returns the assets corresponding to those product identifiers
   * @param prodIds the product identifiers of the assets information is needed for
   * @returns An array of assets corresponding to the requested product identifiers
   */
  getMany: async (prodIds: Array<string>): Promise<Asset[]> => {
    try {
      const { data } = await instance.post(`/asset/get-many`, {
        prodIds,
      });
      return data.assets;
    } catch (err) {
      console.error(err.message);
      throw new Error("Failed to retrieve asset data");
    }
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
