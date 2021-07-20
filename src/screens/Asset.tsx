import React, { useEffect, useState, useContext } from "react";
import { Flex, VStack, Heading, HStack, Box } from "@chakra-ui/layout";
import { BellIcon, StarIcon } from "@chakra-ui/icons";
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
  Spinner,
} from "@chakra-ui/react";
import assetApi from "../api/asset";
import { Asset } from "../index.d";
import Trade from "../components/Trade";
import Chart from "../components/Chart";
import { toCurrency } from "../formatting";
import { UserContext } from "../contexts/UserContext";

const AssetScreen = (props: any) => {
  const { assets } = useContext(UserContext);
  const [asset, setAsset] = useState<Asset | undefined>();
  const [quantity, setQuantity] = useState(0);
  const [priceEventsData, setPriceEventsData] = useState([]);

  const [color, setColor] = useState("green");
  const [prelude, setPrelude] = useState("-");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { asset, priceEvents } = await assetApi.getAssetData(
        props.match.params.id
      );
      setAsset(asset);
      setPriceEventsData(priceEvents);

      const a = assets.filter(
        (a) => asset.productIdentifier === a.asset.productIdentifier
      )[0];

      setQuantity(a ? a.quantity : 0);

      if (asset.changePercentage > 0) {
        setColor("green");
        setPrelude("+");
      } else {
        setColor("red");
        setPrelude("-");
      }
      setLoading(false);
    })();
  }, [props.match.params.id, assets]);

  return (
    <Flex style={{ paddingTop: "5%", paddingLeft: "2%" }}>
      <VStack style={{ width: "80%" }}>
        <HStack width="100%" style={{ alignItems: "start" }}>
          <VStack style={{ flex: 3 }}>
            <HStack
              style={{
                justifyContent: "space-between",
                width: "100%",
                padding: "2%",
              }}
            >
              {!loading && (
                <Box>
                  <HStack>
                    <chakra.img
                      src={asset?.image}
                      style={{ height: 50, width: 50 }}
                    />
                    <Heading size="lg">{asset?.name}</Heading>
                  </HStack>
                  <HStack width="100%">
                    <Text style={{ fontSize: 30 }}>
                      {asset?.askMarketPrice &&
                        toCurrency(asset.askMarketPrice)}
                    </Text>
                    <Text>USD</Text>
                  </HStack>
                  <Text style={{ fontWeight: "bold", color }}>
                    {prelude}
                    {toCurrency(Math.abs(asset?.changeAmount as number))}{" "}
                    {`(${prelude}${Math.abs(
                      asset?.changePercentage as number
                    )}%)`}
                  </Text>
                </Box>
              )}
              <Box>
                {!loading && (
                  <HStack>
                    <Button>
                      Watch{" "}
                      <StarIcon
                        style={{
                          marginLeft: "7%",
                        }}
                        w={3}
                        h={3}
                      />
                    </Button>
                    <Button>
                      <BellIcon />
                    </Button>
                  </HStack>
                )}
              </Box>
            </HStack>

            {!loading && <Chart data={priceEventsData} />}
            {loading && <Spinner />}
          </VStack>
          {!loading && (
            <Box style={{ padding: "2%", flex: 1 }}>
              <Trade
                productIdentifier={asset?.productIdentifier as string}
                askMarketPrice={asset?.askMarketPrice as number}
                bidMarketPrice={asset?.bidMarketPrice as number}
                assetName={asset?.name as string}
              />
            </Box>
          )}
        </HStack>

        {!loading && (
          <Box width="100%" pl="2%">
            <Heading size="md" style={{ paddingBottom: "1%" }}>
              About {asset?.name} {asset?.year}
            </Heading>
            <Text style={{ paddingLeft: "1%" }}>{asset?.details?.blurb}</Text>
          </Box>
        )}

        {quantity > 0 && (
          <Box width="100%" pt="2%" pl="2%">
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
                  <Td>
                    {asset?.askMarketPrice &&
                      `${toCurrency(quantity * asset?.askMarketPrice)}`}
                  </Td>
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
