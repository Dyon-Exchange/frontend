import React, { useState } from "react";
import { Flex } from "@chakra-ui/layout";
import { useRouteMatch } from "react-router";
// import { redeemed as dummyRedeem } from "../dummydata";
import Confirm from "../components/Redeem/Confirm";
import Select from "../components/Redeem/Select";
import Complete from "../components/Redeem/Complete";
import tokenApi from "../api/token";
import { Switch, Route, useHistory } from "react-router-dom";

export type RedeemStage = "Select" | "Confirm" | "Complete";

export interface Redeemed {
  productIdentifier: string;
  units: number;
  txHash: string;
}

function Redeem() {
  let { path } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [toRedeem, setToRedeem] = useState<{ [key: string]: string }>({});
  const [redeemed, setRedeemed] = useState<Redeemed[]>([]);

  const history = useHistory();

  const redemptionConfirmClick = async () => {
    setLoading(true);
    try {
      const toRedeemArr = Object.keys(toRedeem).map((key) => {
        return { productIdentifier: key, units: Number(toRedeem[key]) };
      });
      const redeemed = await tokenApi.redeem(toRedeemArr);
      setRedeemed(redeemed);
      history.push(`${path}/complete`);
    } catch (e) {
      window.alert("There was an error redeemed your tokens");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch>
      <Route exact path={path}>
        <Flex justifyContent="center" py="10">
          <Select
            setStage={() => history.push(`${path}/confirm`)}
            toRedeem={toRedeem}
            setToRedeem={setToRedeem}
          />
        </Flex>
      </Route>
      <Route exact path={`${path}/confirm`}>
        <Flex justifyContent="center" py="10">
          <Confirm
            loading={loading}
            click={redemptionConfirmClick}
            toRedeem={toRedeem}
          />
        </Flex>
      </Route>
      <Route exact path={`${path}/complete`}>
        <Complete redeemed={redeemed} />
      </Route>
    </Switch>
  );
}

export default Redeem;
