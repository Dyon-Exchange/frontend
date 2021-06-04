import React, { createContext, ReactChild, useEffect, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { Asset } from "../index.d";
import user from "../api/user";
import assetApi from "../api/asset";

interface IUserContext {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
  cashBalance: number;
  assets: Asset[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext(null as any as IUserContext);

export const UserContextProvider = ({ children }: { children: ReactChild }) => {
  const [email, setEmail] = useLocalStorage("email", "");
  const [token, setToken] = useLocalStorage("token", "");
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", "");
  const [fullName, setFullName] = useState("");
  const [cashBalance, setCashBalance] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(10);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    (async () => {
      const a = await assetApi.get();
      setAssets(a);
    })();
  }, []);

  // UseEffect to run whenever a user is logged in
  useEffect(() => {
    if (token === "") {
      return;
    }

    (async () => {
      const { fullName, cashBalance } = await user.get();
      setFullName(fullName);
      setCashBalance(cashBalance);
    })();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await user.login(email, password);
    setEmail(email);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
  };

  const logout = async () => {
    setEmail("");
    setToken("");
    setRefreshToken("");
  };

  return (
    <UserContext.Provider
      value={{
        email,
        token,
        refreshToken,
        fullName,
        cashBalance,
        login,
        assets,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
