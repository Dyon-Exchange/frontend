import instance from "./instance";

const userRequests = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string }> => {
    const res = await instance.post("/user/login", { email, password });
    return res.data;
  },
  /*
   * Get details for logged in user
   */
  get: async (): Promise<{
    fullName: string;
    cashBalance: number;
    email: string;
  }> => {
    const res = await instance.get("/user/");
    return res.data;
  },
};

export default userRequests;
