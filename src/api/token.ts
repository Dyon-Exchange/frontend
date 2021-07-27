import { Asset, Token } from "../index.d";
import instance from "./instance";
import { Redeemed } from "../screens/Redeem";

const tokens = {
  /*
   * Add a token
   */
  put: async (
    productCode: string,
    caseId: string,
    locationId: string,
    taxCode: string,
    conditionCode: string,
    year: string,
    name: string,
    supply: number
  ): Promise<{ asset: Asset; token: Token; txHash: string }> => {
    const response = await instance.put("/token/", {
      productCode,
      caseId,
      locationId,
      taxCode,
      conditionCode,
      year,
      name,
      supply,
    });
    return response.data;
  },
  /*
   * Redeem tokens
   */
  redeem: async (
    toRedeem: { productIdentifier: string; units: number }[]
  ): Promise<Redeemed[]> => {
    const { data } = await instance.post("/token/redeem", { toRedeem });
    return data.redeemed;
  },
};

export default tokens;
