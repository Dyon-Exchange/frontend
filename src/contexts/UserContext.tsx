import React, { createContext, ReactChild, useEffect, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { Asset, UserAsset, LimitOrder, MarketOrder } from "../index.d";
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
  assets: UserAsset[];
  userLimitOrders: LimitOrder[];
  userMarketOrders: MarketOrder[];

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
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [userLimitOrders, setUserLimitOrders] = useState<LimitOrder[]>([]);
  const [userMarketOrders, setUserMarketOrders] = useState<MarketOrder[]>([]);

  // UseEffect to run whenever a user is logged in
  useEffect(() => {
    if (token === "" || !token) {
      return;
    }

    (async () => {
      refreshUserOrders();
      refreshUserPortfolio();
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
    setUserLimitOrders(userOrders.limitOrders);
    setUserMarketOrders(userOrders.marketOrders);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (token === "" || !token) {
        return;
      }

      refreshUserOrders();
      refreshUserPortfolio();
    }, 3 * 1000);
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
        userLimitOrders,
        userMarketOrders,
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
