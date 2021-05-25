import instance from "./instance";

export default {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string }> => {
    const res = await instance.post("/user/login", { email, password });
    return res.data;
  },
};
