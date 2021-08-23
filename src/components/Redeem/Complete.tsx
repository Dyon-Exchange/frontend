import React, { FC, useEffect, useMemo, useState } from "react";
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
import { Redeemed } from "../../pages/Redeem";
import { map } from "lodash";
import assetApi from "../../api/asset";

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

interface CompleteProps {
  redeemed: Redeemed[];
}

const Complete: FC<CompleteProps> = ({ redeemed }) => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const getAssets = async () => {
      const prodIds = map(redeemed, (prod) => prod.productIdentifier);
      const assets = await assetApi.getMany(prodIds);
      setAssets([...assets]);
    };
    getAssets();
  }, [redeemed]);

  const rows = useMemo(() => {
    let rows: Row[] = [];
    if (!assets.length) return rows;
    assets.forEach(function (a) {
      const index = redeemed.findIndex(
        (r) => r.productIdentifier === a.productIdentifier
      );
      if (index !== -1) {
        rows.push({ ...a, ...redeemed[index] });
      }
    });
    return rows;
  }, [redeemed, assets]);

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
};

export default Complete;
