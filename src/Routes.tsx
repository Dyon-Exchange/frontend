import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignedInHeader from "./screens/Header";
import Header from "./screens/PreSignInHeader";
import { SignIn } from "./screens/SignIn";
import { UserContext } from "./contexts/UserContext";

export default function Routes() {
  const { token } = useContext(UserContext);

  return (
    <Router>
      {token ? <SignedInHeader /> : <Header />}
      <Switch>
        {token ? (
          <>
            <Route path="/market" />
            <Route path="/portfolio" />
          </>
        ) : (
          <Route path="/signin" component={SignIn}></Route>
        )}
      </Switch>
    </Router>
  );
}
