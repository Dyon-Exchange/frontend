import React, { useState } from "react";
import { Flex } from "@chakra-ui/layout";
// import { redeemed as dummyRedeem } from "../dummydata";
import Confirm from "../components/Redeem/Confirm";
import Select from "../components/Redeem/Select";
import Complete from "../components/Redeem/Complete";
import tokenApi from "../api/token";

export type RedeemStage = "Select" | "Confirm" | "Complete";

export interface Redeemed {
  productIdentifier: string;
  units: number;
  txHash: string;
}

function Redeem() {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<RedeemStage>("Select");
  const [toRedeem, setToRedeem] = useState<{ [key: string]: string }>({});
  const [redeemed, setRedeemed] = useState<Redeemed[]>([]);

  const redemptionConfirmClick = async () => {
    setLoading(true);
    try {
      const toRedeemArr = Object.keys(toRedeem).map((key) => {
        return { productIdentifier: key, units: Number(toRedeem[key]) };
      });
      const redeemed = await tokenApi.redeem(toRedeemArr);
      setRedeemed(redeemed);
      setStage("Complete");
    } catch (e) {
      window.alert("There was an error redeemed your tokens");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" py="10">
      {stage === "Select" && (
        <Select
          setStage={setStage}
          toRedeem={toRedeem}
          setToRedeem={setToRedeem}
        />
      )}
      {stage === "Confirm" && (
        <Confirm
          loading={loading}
          click={redemptionConfirmClick}
          toRedeem={toRedeem}
        />
      )}
      {stage === "Complete" && <Complete redeemed={redeemed} />}
    </Flex>
  );
}

export default Redeem;
