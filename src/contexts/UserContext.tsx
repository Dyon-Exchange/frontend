import React, { createContext, ReactChild, useEffect, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { Asset, UserAsset } from "../index.d";
import user from "../api/user";
import assetApi from "../api/asset";

interface IUserContext {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
  cashBalance: number;
  portfolioValue: number;
  allAssets: Asset[];
  assets: UserAsset[];
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
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [assets, setAssets] = useState<UserAsset[]>([]);

  useEffect(() => {
    (async () => {
      const a = await assetApi.get();
      setAllAssets(a);
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
      const { assets, portfolioBalance } = await assetApi.getUserAssets();
      setAssets(assets);
      setPortfolioValue(portfolioBalance);
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
        portfolioValue,
        login,
        allAssets,
        assets,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
