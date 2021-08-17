import React, { useState, useContext, useEffect } from "react";
import { Flex, Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  chakra,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { UserAsset } from "../../index.d";
import { UserContext } from "../../contexts/UserContext";
import { toCurrency } from "../../formatting";
import { RedeemStage } from "../../pages/Redeem";
import { determineContractSize } from "../../helpers/determineContractSize";

interface ITableRowProps {
  r: UserAsset;
  setToRedeem: (id: string, quantity: string) => void;
  removeToRedeemAsset: (id: string) => void;
}

const TableRow: React.FC<ITableRowProps> = ({
  r,
  setToRedeem,
  removeToRedeemAsset,
}) => {
  const [checked, setChecked] = useState(false);
  const [units, setUnits] = useState(Math.floor(r.quantity).toString());

  useEffect(() => {
    if (!checked) {
      removeToRedeemAsset(r.asset.productIdentifier);
    } else {
      let num = Math.round(Number(units));
      if (num > Math.floor(r.quantity)) {
        num = Math.floor(r.quantity);
      }
      setToRedeem(r.asset.productIdentifier, num.toString());
    }
  }, [checked]); // eslint-disable-line

  return (
    <Tr>
      <Td style={{ textAlign: "center" }}>
        <chakra.img src={r.asset.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {r.asset.name} {r.asset.year}
      </Td>
      <Td style={{ textAlign: "center" }}>{r.quantity}</Td>
      <Td style={{ textAlign: "center" }}>
        {r.asset.productIdentifier &&
          determineContractSize(r.asset.productIdentifier)}
      </Td>
      <Td style={{ textAlign: "center" }}>
        <NumberInput
          precision={0}
          value={units}
          max={Math.floor(r.quantity)}
          onChange={(e) => {
            if (r.quantity < Number(e)) {
              setUnits(Math.floor(r.quantity).toString());
            } else {
              setUnits(e);
            }
            if (Number(e) === 0) {
              setChecked(false);
            } else {
              setChecked(true);
            }
          }}
          size="m"
          style={{ alignContent: "center" }}
        >
          <NumberInputField style={{ textAlign: "center" }} />
        </NumberInput>
      </Td>

      <Td style={{ textAlign: "center" }}>
        {(r.asset.bidMarketPrice &&
          toCurrency(Number(units) * r.asset.bidMarketPrice)) ||
          "-"}
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Checkbox isChecked={checked} onChange={() => setChecked(!checked)} />
      </Td>
    </Tr>
  );
};

function Select(props: {
  setStage: (stage: RedeemStage) => void;
  toRedeem: { [key: string]: string };
  setToRedeem: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}) {
  const { setStage, toRedeem, setToRedeem } = props;
  const { assets } = useContext(UserContext);

  const [rows] = useState<UserAsset[]>(assets);

  const setToRedeemAsset = (id: string, quantity: string) => {
    toRedeem[id] = quantity;
    setToRedeem({
      ...toRedeem,
    });
  };

  const removeToRedeemAsset = (id: string) => {
    delete toRedeem[id];
    setToRedeem({
      ...toRedeem,
    });
  };

  return (
    <Flex flexDirection="row" justifyContent="center">
      <VStack width="100%">
        <Heading size="lg">Redeem</Heading>
        <Box py="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th style={{ textAlign: "center" }}></Th>
                <Th style={{ textAlign: "center" }}></Th>
                <Th style={{ textAlign: "center" }}>Total Units Owned</Th>
                <Th style={{ textAlign: "center" }}>Contract Size</Th>
                <Th style={{ textAlign: "center" }}>Units to redeem</Th>
                <Th style={{ textAlign: "center" }}>Market Value</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((a: UserAsset) => (
                <TableRow
                  r={a}
                  key={a.asset.productIdentifier}
                  setToRedeem={setToRedeemAsset}
                  removeToRedeemAsset={removeToRedeemAsset}
                />
              ))}
            </Tbody>
          </Table>
        </Box>
        <Button onClick={() => setStage("Confirm")} alignSelf="flex-end">
          Redeem Selected Items
        </Button>
        <Text fontSize="sm" alignSelf="flex-end" fontWeight="thin">
          Units will be delivered to WineTrust account
        </Text>
      </VStack>
    </Flex>
  );
}

export default Select;
