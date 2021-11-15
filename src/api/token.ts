import instance from "./instance";

const tokens = {
  put: async (
    productCode: string,
    caseId: string,
    locationId: string,
    taxCode: string,
    conditionCode: string,
    year: string,
    name: string,
    supply: number
  ): Promise<{ asset: any; token: any; txHash: string }> => {
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
};
export default tokens;
