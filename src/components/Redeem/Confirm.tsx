import React, { useEffect, useState } from "react";
import { Heading, VStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  chakra,
  Text,
  Stack,
} from "@chakra-ui/react";
import { Asset } from "../../index.d";
import { toCurrency } from "../../formatting";
import { determineContractSize } from "../../helpers/determineContractSize";
import assetApi from "../../api/asset";

function TableRow(props: { asset: Asset; units: number }) {
  const { asset, units } = props;
  return (
    <Tr>
      <Td style={{ textAlign: "center" }}>
        <chakra.img src={asset.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {asset.name} {asset.year}
      </Td>
      <Td style={{ textAlign: "center" }}>
        {asset.productIdentifier &&
          determineContractSize(asset.productIdentifier)}
      </Td>
      <Td style={{ textAlign: "center" }}>{units}</Td>
      <Td style={{ textAlign: "center" }}>
        {(asset.bidMarketPrice &&
          toCurrency(Number(units) * asset.bidMarketPrice)) ||
          "-"}
      </Td>
    </Tr>
  );
}

function Confirm(props: {
  toRedeem: { [key: string]: string };
  click: () => Promise<void>;
  loading: boolean;
}) {
  const { loading, toRedeem, click } = props;
  const [assets, setAssets] = useState<Asset[]>([]);
  console.log(toRedeem);

  useEffect(() => {
    const prodIds = Object.keys(toRedeem);
    console.log(prodIds);
    const getAssets = async () => {
      const assets = await assetApi.getMany(prodIds);
      setAssets([...assets]);
    };
    getAssets();
  }, [toRedeem]);

  return (
    <VStack width="75%">
      <Heading size="lg">Confirm Redemption Request</Heading>
      <Stack paddingY="10">
        <Table variant="simple" marginBottom="1rem">
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center" }}></Th>
              <Th style={{ textAlign: "center" }}>Item</Th>
              <Th style={{ textAlign: "center" }}>Contract Size</Th>
              <Th style={{ textAlign: "center" }}>Quantity to be redeemed</Th>
              <Th style={{ textAlign: "center" }}>Market Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assets.map((a: Asset) => (
              <TableRow
                key={a.productIdentifier}
                units={Number(toRedeem[a.productIdentifier])}
                asset={a}
              />
            ))}
          </Tbody>
        </Table>
        <Button
          onClick={() => click()}
          isLoading={loading}
          alignSelf="flex-end"
          loadingText="Redeeming"
        >
          Confirm Redemption
        </Button>
        <Text
          width="60%"
          fontSize="xs"
          fontWeight="thin"
          alignSelf="flex-end"
          paddingTop="1rem"
          textAlign="right"
        >
          On confirmation these cases will be delivered to a WineTrust warehouse
          and will no longer be part of the WineBit ecosystem. The unique tokens
          associated with these cases will be burned (destroyed). This action
          cannot be undone.
        </Text>
      </Stack>
    </VStack>
  );
}

export default Confirm;
