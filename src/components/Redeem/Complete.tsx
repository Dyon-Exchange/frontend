import React, { useContext, useState } from "react";
import { Flex, VStack, Heading } from "@chakra-ui/layout";
import {
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from "@chakra-ui/react";
import { Asset } from "../../index.d";
import { UserContext } from "../../contexts/UserContext";
import { Redeemed } from "../../screens/Redeem";

const TableRow = (props: { asset: Asset; units: number }) => {
  const { asset, units } = props;
  return (
    <Tr>
      <Td style={{ textAlign: "center" }}>
        <chakra.img src={asset.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {asset.name} {asset.year}
      </Td>
      <Td style={{ textAlign: "center" }}>{units}</Td>
      <Td style={{ textAlign: "center" }}>WineTrust London City Bond</Td>
    </Tr>
  );
};

interface Row extends Asset, Redeemed {}

function Complete(props: { redeemed: Redeemed[] }) {
  const { redeemed } = props;
  const { allAssets } = useContext(UserContext);

  // Fill rows array by merging Asset and Redeem arrays
  const [rows] = useState<Row[]>(() => {
    const arr: Row[] = [];

    console.log(redeemed);
    allAssets.forEach(function (a) {
      const index = redeemed.findIndex(
        (r) => r.productIdentifier === a.productIdentifier
      );
      if (index !== -1) {
        arr.push({ ...a, ...redeemed[index] });
      }
    });
    return arr;
  });

  return (
    <Flex flexDirection="row" justifyContent="center" width="50%">
      <VStack width="100%">
        <Heading size="lg">Redemption Confirmation</Heading>
        <Text width="50%" py="10">
          These cases will now be delivered to a WineTrust warehouse and will no
          longer be part of the WineBit ecosystem. The unique tokens associated
          with these cases have been burned (destroyed). An email confirmation
          with these details and next steps on arranging delivery / storage at
          WineTrust has been emailed to you.
        </Text>
        <Box py="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th>Redeemed</Th>
                <Th>Delivered to</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((a: Row) => (
                <TableRow key={a.productIdentifier} asset={a} units={a.units} />
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box justifyContent="left">
          <Text>Tokens redeemed:</Text>
          {rows.map((a: Row) => (
            <Text>{a.txHash}</Text>
          ))}
        </Box>
      </VStack>
    </Flex>
  );
}

export default Complete;
