import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignedInHeader from "./components/Header";
import Header from "./components/PreSignInHeader";
import { SignIn } from "./pages/SignIn";
import { UserContext } from "./contexts/UserContext";
import Market from "./pages/Market";
import Mint from "./pages/Mint";
import Portfolio from "./pages/Portfolio";
import Asset from "./pages/Asset";
import PendingOrders from "./pages/PendingOrders";
import CompletedOrders from "./pages/CompletedOrders";
import Redeem from "./pages/Redeem";

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
