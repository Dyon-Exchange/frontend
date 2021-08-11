import React, { useContext, useState } from "react";
import { VStack, Heading } from "@chakra-ui/layout";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Link,
} from "@chakra-ui/react";
import { Asset } from "../../index.d";
import { UserContext } from "../../contexts/UserContext";
import { Redeemed } from "../../screens/Redeem";

const TableRow = (props: { asset: Asset; units: number; hash: string }) => {
  const { asset, units, hash } = props;
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
      <Td style={{ textAlign: "center" }}>
        <Link
          color="blue"
          href={`https://kovan.etherscan.io/tx/${hash}`}
          target="_blank"
        >
          View on Etherscan
        </Link>
      </Td>
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
    <VStack width="60%">
      <Heading size="lg" marginBottom="3rem">
        Redemption Confirmed
      </Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th style={{ textAlign: "center" }}>Item</Th>
            <Th style={{ textAlign: "center" }}>Quantity Redeemed</Th>
            <Th style={{ textAlign: "center" }}>Delivered to</Th>
            <Th style={{ textAlign: "center" }}>Transaction Record</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((a: Row) => (
            <TableRow
              key={a.productIdentifier}
              asset={a}
              units={a.units}
              hash={a.txHash}
            />
          ))}
        </Tbody>
      </Table>

      <Text
        width="60%"
        fontSize="xs"
        fontWeight="thin"
        alignSelf="flex-end"
        paddingTop="1rem"
        textAlign="right"
      >
        These cases will now be delivered to a WineTrust warehouse and will no
        longer be part of the WineBit ecosystem. The unique tokens associated
        with these cases have been burned (destroyed). An email confirmation
        with these details and next steps on arranging delivery / storage at
        WineTrust has been emailed to you.
      </Text>
    </VStack>
  );
}

export default Complete;
