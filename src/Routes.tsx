import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignedInHeader from "./screens/Header";
import Header from "./screens/PreSignInHeader";
import { SignIn } from "./screens/SignIn";
import { UserContext } from "./contexts/UserContext";
import Market from "./screens/Market";
import Mint from "./screens/Mint";
import Portfolio from "./screens/Portfolio";

export default function Routes() {
  const { token } = useContext(UserContext);

  return (
    <Router>
      {token ? <SignedInHeader /> : <Header />}
      <Switch>
        {token ? (
          <>
            <Route path="/market" component={Market} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/mint" component={Mint} />
          </>
        ) : (
          <Route path="/signin" component={SignIn}></Route>
        )}
      </Switch>
    </Router>
  );
}
