import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignedInHeader from "./components/Header";
import Header from "./components/PreSignInHeader";
import { SignIn } from "./screens/SignIn";
import { UserContext } from "./contexts/UserContext";
import Market from "./screens/Market";
import Mint from "./screens/Mint";
import Portfolio from "./screens/Portfolio";
import Asset from "./screens/Asset";
import PendingOrders from "./screens/PendingOrders";
import CompletedOrders from "./screens/CompletedOrders";
import Redeem from "./screens/Redeem";

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
            <Route path="/redeem" component={Redeem} />
          </>
        ) : (
          <>
            <Route exact path="/signin" component={SignIn}></Route>
            <Route path="/">
              <Redirect to="/signin" />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
}
