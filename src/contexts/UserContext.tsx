import React, { createContext, ReactChild, useEffect, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { Asset, UserAsset, LimitOrder } from "../index.d";
import user from "../api/user";
import assetApi from "../api/asset";
import orderApi from "../api/order";

interface IUserContext {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
  cashBalance: number;
  portfolioValue: number;
  allAssets: Asset[];
  assets: UserAsset[];
  userOrders: LimitOrder[];

  methods: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;

    refreshUserPortfolio: () => Promise<void>;
    refreshUserOrders: () => Promise<void>;
  };
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
  const [userOrders, setUserOrders] = useState<LimitOrder[]>([]);

  // UseEffect to run whenever a user is logged in
  useEffect(() => {
    if (token === "" || !token) {
      return;
    }

    (async () => {
      refreshUserPortfolio();
      refreshUserOrders();

      const a = await assetApi.get();
      setAllAssets(a);

      refreshUserOrders();
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

  const refreshUserPortfolio = async () => {
    (async () => {
      const { fullName, cashBalance } = await user.get();
      setFullName(fullName);
      setCashBalance(cashBalance);
    })();

    const { assets, portfolioBalance } = await assetApi.getUserAssets();
    setAssets(assets);
    setPortfolioValue(portfolioBalance);
  };

  const refreshUserOrders = async () => {
    const userOrders = await orderApi.get();
    setUserOrders(userOrders.limitOrders);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (token === "" || !token) {
        return;
      }

      refreshUserOrders();
      refreshUserPortfolio();
    }, 5 * 1000);
    return () => clearInterval(interval);
  });

  return (
    <UserContext.Provider
      value={{
        email,
        token,
        refreshToken,
        fullName,
        cashBalance,
        portfolioValue,
        allAssets,
        userOrders,
        assets,
        methods: {
          login,
          logout,

          refreshUserOrders,
          refreshUserPortfolio,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
