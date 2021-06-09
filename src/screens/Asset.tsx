import React, { useEffect, useState, useContext } from "react";
import { Flex, VStack, Heading, HStack, Box } from "@chakra-ui/layout";
import {
  Text,
  Button,
  chakra,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import assetApi from "../api/asset";
import { Asset } from "../index.d";
import Trade from "./Trade";
import { UserContext } from "../contexts/UserContext";

const AssetScreen = (props: any) => {
  console.log(props.match.params.id);

  const [asset, setAsset] = useState<Asset | undefined>();
  const [quantity, setQuantity] = useState(0);
  const { assets } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const asset = await assetApi.getAssetData(props.match.params.id);
      setAsset(asset);
      const a = assets.filter(
        (a) => asset.productIdentifier === a.asset.productIdentifier
      )[0];

      setQuantity(a ? a.quantity : 0);
    })();
  }, [props.match.params.id]);

  return (
    <Flex style={{ paddingTop: "5%", paddingLeft: "2%" }}>
      <VStack style={{ width: "80%" }}>
        <HStack width="100%" style={{ alignItems: "start" }}>
          <HStack
            style={{
              justifyContent: "space-between",
              width: "100%",
              padding: "2%",
            }}
          >
            <Box>
              <HStack>
                <chakra.img
                  src={asset?.image}
                  style={{ height: 50, width: 50 }}
                />
                <Heading size="lg">{asset?.name}</Heading>
              </HStack>
              <HStack width="100%">
                <Text style={{ fontSize: 30 }}>${asset?.marketPrice}</Text>
                <Text>USD</Text>
              </HStack>
            </Box>
            <Box>
              <HStack>
                <Button>Watch</Button>
                <Button>Bell</Button>
              </HStack>
            </Box>
          </HStack>
          <Box style={{ padding: "2%" }}>
            <Trade
              productIdentifier={asset?.productIdentifier as string}
              marketPrice={asset?.marketPrice as number}
            />
          </Box>
        </HStack>
        <Box width="100%">
          <Heading size="md" style={{ paddingBottom: "1%" }}>
            About {asset?.name} {asset?.year}
          </Heading>
          <Text style={{ paddingLeft: "1%" }}>{asset?.details?.blurb}</Text>
        </Box>

        {quantity > 0 && (
          <Box width="100%" pt="2%">
            <Heading size="md" style={{ paddingBottom: "1%" }}>
              My {asset?.name} {asset?.year}
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Value</Th>
                  <Th>Units owned {asset?.unitSize}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {asset?.name} {asset?.year}
                  </Td>
                  <Td>{quantity * (asset?.marketPrice as number)} USD</Td>
                  <Td>{quantity}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default AssetScreen;
