import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import SignedInHeader from "./components/Header";
import Header from "./components/PreSignInHeader";
import { UserContext } from "./contexts/UserContext";
import Asset from "./screens/Asset";
import CompletedOrders from "./screens/CompletedOrders";
import Market from "./screens/Market";
import Mint from "./screens/Mint";
import PendingOrders from "./screens/PendingOrders";
import Portfolio from "./screens/Portfolio";
import { SignIn } from "./screens/SignIn";

export default function Routes() {
  const { token } = useContext(UserContext);

  return (
    <Router>
      {token ? <SignedInHeader /> : <Header />}
      <Switch>
        {token ? (
          <>
            <Route exact path="/">
              <Redirect to="/market" />
            </Route>
            <Route path="/market" component={Market} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/mint" component={Mint} />
            <Route path="/asset/:id" component={Asset} />
            <Route path="/pendingorders" component={PendingOrders} />
            <Route path="/completedorders" component={CompletedOrders} />
          </>
        ) : (
          <>
            <Route exact path="/">
              <Redirect to="/signin" />
            </Route>
            <Route path="/signin" component={SignIn} />
          </>
        )}
      </Switch>
    </Router>
  );
}
