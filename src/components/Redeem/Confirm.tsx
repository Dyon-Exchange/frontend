import React, { useContext, useState } from "react";
import { Flex, Box, Heading, VStack } from "@chakra-ui/layout";
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
} from "@chakra-ui/react";
import { UserContext } from "../../contexts/UserContext";
import { Asset } from "../../index.d";
import { toCurrency } from "../../formatting";

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
      <Td style={{ textAlign: "center" }}>{units}</Td>
      <Td style={{ textAlign: "center" }}>
        {asset.bidMarketPrice &&
          toCurrency(Number(units) * asset.bidMarketPrice)}
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
  const { allAssets } = useContext(UserContext);

  // Fill rows array by filtering all assets to only the ones that we want to redeem
  const [rows] = useState<Asset[]>(
    allAssets.filter((a) => toRedeem[a.productIdentifier])
  );

  return (
    <Flex flexDirection="row" justifyContent="center" width="50%">
      <VStack width="100%">
        <Heading size="lg">Units being redeemed</Heading>
        <Text width="50%" py="10">
          These cases will now be delivered to a WineTrust warehouse and will no
          longer be part of the WineBit ecosystem. The unique tokens associated
          with these cases will be burned (destroyed). This action cannot be
          undone.
        </Text>
        <Box py="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th style={{ textAlign: "center" }}></Th>
                <Th style={{ textAlign: "center" }}></Th>
                <Th style={{ textAlign: "center" }}>Being redeemed</Th>
                <Th style={{ textAlign: "center" }}>Market Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((a: Asset) => (
                <TableRow
                  key={a.productIdentifier}
                  units={Number(toRedeem[a.productIdentifier])}
                  asset={a}
                />
              ))}
            </Tbody>
          </Table>
        </Box>
        <Button my="10" onClick={() => click()} isLoading={loading}>
          Confirm Redemption
        </Button>
      </VStack>
    </Flex>
  );
}

export default Confirm;
