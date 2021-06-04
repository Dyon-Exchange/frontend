import { Asset, Token } from "../index.d";
import instance from "./instance";

export default {
  put: async (
    productCode: string,
    caseId: string,
    locationId: string,
    taxCode: string,
    conditionCode: string,
    year: string,
    name: string
  ): Promise<{ asset: Asset; token: Token; txHash: string }> => {
    const response = await instance.put("/token/", {
      productCode,
      caseId,
      locationId,
      taxCode,
      conditionCode,
      year,
      name,
    });
    return response.data;
  },
};
