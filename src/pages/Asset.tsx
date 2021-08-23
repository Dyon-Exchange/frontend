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
  Stack,
} from "@chakra-ui/react";
import assetApi from "../api/asset";
import orderApi from "../api/order";
import {
  Asset,
  GetOrdersResponse,
  OrderBookOrder,
  PriceEvent,
} from "../index.d";
import Trade from "../components/Trade";
import Chart from "../components/Chart";
import { toCurrency } from "../formatting";
import { UserContext } from "../contexts/UserContext";
import OrderBook from "../components/OrderBook";
import { determineContractSize } from "../helpers/determineContractSize";

function AboutTable() {
  return (
    <Stack isInline width="100%" spacing={4} justify="space-around">
      <Table
        style={{
          maxWidth: "45%",
          backgroundColor: "#f2f2f2",
        }}
        variant="unstyled"
      >
        <Tr>
          <Td fontWeight="bold">Year</Td>
          <Td>2009</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Colour</Td>
          <Td>Red</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Country</Td>
          <Td>France</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Region</Td>
          <Td>Bordeaux</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Sub Region</Td>
          <Td>Pauillac</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Unit Size</Td>
          <Td>(6x75cl)</Td>
        </Tr>
      </Table>
      <Table
        style={{
          maxWidth: "45%",
          backgroundColor: "#f2f2f2",
          height: "100%",
        }}
        variant="unstyled"
        alignSelf="start"
      >
        <Tr>
          <Td fontWeight="bold">Wine Advocate</Td>
          <Td>98-100</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Decanter</Td>
          <Td>98-100</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">James Suckling</Td>
          <Td>99</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Jeb Dunnuck</Td>
          <Td>98</Td>
        </Tr>
        <Tr>
          <Td fontWeight="bold">Vinous</Td>
          <Td>96</Td>
        </Tr>
      </Table>
      ;
    </Stack>
  );
}

const AssetScreen = (props: any) => {
  const { assets, userLimitOrders, userMarketOrders } = useContext(UserContext);
  const [asset, setAsset] = useState<Asset | undefined>();
  const [quantity, setQuantity] = useState(0);
  const [priceEventsData, setPriceEventsData] = useState<PriceEvent[]>([]);
  const [orders, setOrders] = useState<GetOrdersResponse>({
    buy: [],
    sell: [],
  });
  const [rows, setRows] = useState<OrderBookOrder[]>([]);

  const [color, setColor] = useState("green");
  const [prelude, setPrelude] = useState("-");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setOrders(await orderApi.getOrders(props.match.params.id));

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

  useEffect(() => {
    let interval = setInterval(async () => {
      setOrders(await orderApi.getOrders(props.match.params.id));
      //@ts-ignore
      setRows(Object.values(orders).flat());
    }, 1 * 1000);
    return () => clearInterval(interval);
  });

  return (
    <Flex style={{ paddingTop: "5%", paddingLeft: "2%" }}>
      <VStack style={{ width: "100%" }}>
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
                    <Box>
                      <Heading size="lg">{asset?.name}</Heading>
                      <Text fontSize="xs">
                        {asset &&
                          determineContractSize(asset.productIdentifier)}
                      </Text>
                    </Box>
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
          <>
            <Box width="100%" pl="2%" py="5">
              <Heading size="md" style={{ paddingBottom: "1%" }}>
                About {asset?.name} {asset?.year}
              </Heading>
              <Text style={{ paddingLeft: "1%" }}>{asset?.details?.blurb}</Text>
            </Box>
            <AboutTable />
          </>
        )}

        {quantity > 0 && (
          <Box width="100%" pt="2%" pl="2%">
            <Heading size="md" style={{ paddingBottom: "1%" }}>
              My Holdings
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
        {(userLimitOrders || userMarketOrders) && (
          <Box width="100%" pt="2%" pl="2%" pb="5%">
            <Heading size="md" style={{ paddingBottom: "1%" }}>
              My Orders
            </Heading>
            {userMarketOrders.length > 0 && (
              <>
                <Heading size="sm" paddingBottom="1%">
                  Market Orders
                </Heading>
                <Table variant="simple" marginBottom="8">
                  <Thead>
                    <Tr>
                      <Th style={{ textAlign: "center" }}>Date</Th>
                      <Th style={{ textAlign: "center" }}>Side</Th>
                      <Th style={{ textAlign: "center" }}>Price</Th>
                      <Th style={{ textAlign: "center" }}>Quantity</Th>
                      <Th style={{ textAlign: "center" }}>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userLimitOrders
                      .filter(
                        (el) =>
                          el.status !== "COMPLETE" && el.status !== "CANCELED"
                      )
                      .sort(
                        (a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()
                      )
                      .map((el) => (
                        <Tr>
                          <Td style={{ textAlign: "center" }}>
                            {el && new Date(el.createdAt).toLocaleDateString()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.side.toUpperCase()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {(el &&
                              new Intl.NumberFormat("en-AU", {
                                currency: "AUD",
                                style: "currency",
                              }).format(el.price)) ||
                              "-"}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.quantity}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            $
                            {(el &&
                              (Number(el.price) * Number(el.quantity)).toFixed(
                                2
                              )) ||
                              "-"}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </>
            )}
            {userLimitOrders.length > 0 && (
              <>
                <Heading size="sm" paddingBottom="1%" marginTop="30px">
                  Limit Orders
                </Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th style={{ textAlign: "center" }}>Date</Th>
                      <Th style={{ textAlign: "center" }}>Side</Th>
                      <Th style={{ textAlign: "center" }}>Price</Th>
                      <Th style={{ textAlign: "center" }}>Quantity</Th>
                      <Th style={{ textAlign: "center" }}>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userLimitOrders
                      .filter(
                        (el) =>
                          el.status !== "COMPLETE" && el.status !== "CANCELED"
                      )
                      .sort(
                        (a, b) =>
                          Number(a.price) * Number(a.quantity) -
                          Number(b.price) * Number(b.quantity)
                      )
                      .map((el) => (
                        <Tr>
                          <Td style={{ textAlign: "center" }}>
                            {el && new Date(el.createdAt).toLocaleDateString()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.side.toUpperCase()}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {(el &&
                              new Intl.NumberFormat("en-AU", {
                                currency: "AUD",
                                style: "currency",
                              }).format(el.price)) ||
                              "-"}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {el && el.quantity}
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            $
                            {(el &&
                              (Number(el.price) * Number(el.quantity)).toFixed(
                                2
                              )) ||
                              "-"}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </>
            )}
          </Box>
        )}
        <Stack width="100%" pt="2%" pl="2%" pb="5%" spacing={4}>
          <Heading size="md" style={{ paddingBottom: "1%" }}>
            Orderbook
          </Heading>
          <OrderBook orders={rows} />
        </Stack>
      </VStack>
    </Flex>
  );
};

export default AssetScreen;
