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

  // if you haven't signed in, renders sign in component
  if (!token) {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/signin" component={SignIn}></Route>
          <Route path="/">
            <Redirect to="/signin" />
          </Route>
        </Switch>
      </Router>
    );
  }
  // Otherwise load routes
  return (
    <Router>
      <SignedInHeader />
      <Switch>
        <Route path="/market" component={Market} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/mint" component={Mint} />
        <Route path="/asset/:id" component={Asset} />
        <Route path="/pendingorders" component={PendingOrders} />
        <Route path="/completedorders" component={CompletedOrders} />
        <Route path="/redeem" component={Redeem} />
        {/* Catches 404 routes and sends you to market page */}
        <Route>
          <Redirect to="/market" />
        </Route>
      </Switch>
    </Router>
  );
}
