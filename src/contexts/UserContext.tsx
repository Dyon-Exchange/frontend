import React, { createContext, ReactChild, useEffect, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import user from "../api/user";

interface IUserContext {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext(null as any as IUserContext);

export const UserContextProvider = ({ children }: { children: ReactChild }) => {
  const [email, setEmail] = useLocalStorage("email", "");
  const [token, setToken] = useLocalStorage("token", "");
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", "");
  const [fullName, setFullName] = useState("");

  // UseEffect to run whenever a user is logged in
  useEffect(() => {
    if (token === "") {
      return;
    }

    (async () => {
      const { fullName } = await user.get();
      setFullName(fullName);
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
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
