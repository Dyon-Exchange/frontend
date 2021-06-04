import { Asset } from "../index.d";
import instance from "./instance";

const assetApi = {
  get: async (): Promise<Asset[]> => {
    const { data } = await instance.get("/asset/");
    return data.assets;
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
