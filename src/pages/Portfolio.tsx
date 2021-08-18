import React, { useContext, useEffect, useState } from "react";
import { Heading, Text } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Progress,
  Stack,
  Container,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { LimitOrder, UserAsset } from "../index.d";
import { toCurrency } from "../formatting";
import { data } from "../dummydata";
import Chart from "../components/Chart";
import OrderTable from "../components/common/OrderTable";

const TableRow = (props: { userAsset: UserAsset }) => {
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${props.userAsset.asset.productIdentifier}`);
  };

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <Td>
        <chakra.img
          style={{
            height: 50,
            width: 50,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          src={props.userAsset.asset.image}
        />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {props.userAsset.asset.name} {props.userAsset.asset.year}
      </Td>
      <Td style={{ textAlign: "center" }}>
        {(props.userAsset.asset.askMarketPrice &&
          toCurrency(props.userAsset.asset.askMarketPrice)) ||
          "-"}
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Text>{props.userAsset.quantity.toFixed(2) || "-"}</Text>
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Text>
          {(props.userAsset.asset.askMarketPrice &&
            toCurrency(
              props.userAsset.asset.askMarketPrice * props.userAsset.quantity
            )) ||
            "-"}
        </Text>
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Progress value={props.userAsset.portfolioShare} />
        {props.userAsset.portfolioShare && (
          <>
            <Text style={{ fontSize: 14, paddingTop: "3%" }}>
              {props.userAsset.portfolioShare &&
              props.userAsset.portfolioShare < 1
                ? "<1%"
                : `${props.userAsset.portfolioShare.toFixed(2)}%`}
            </Text>
          </>
        )}
      </Td>
    </Tr>
  );
};

const Portfolio = () => {
  const { cashBalance, assets, portfolioValue } = useContext(UserContext);
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const { userLimitOrders } = useContext(UserContext);

  useEffect(() => {
    setOrders(userLimitOrders.filter((o) => o.status === "PENDING"));
  }, [userLimitOrders]);

  return (
    <Container maxW="container.xl">
      <Stack marginTop="16" marginX="16" marginBottom="32">
        <Stack>
          <Heading size="lg">My portfolio</Heading>
          <Stack isInline alignItems="flex-end">
            <Text fontSize="30">{toCurrency(portfolioValue)}</Text>
            <Text paddingBottom="2">USD</Text>
          </Stack>
        </Stack>
        <Stack isInline>
          <Chart data={data} />

          {/* <Stack
            backgroundColor="#f2f2f2"
            width="20%"
            borderRadius="10"
            spacing={8}
          >
            <Heading fontWeight="bold" size="sm" padding="4">
              Quick links
            </Heading>
            <NavLink to="/completedorders">
              <Text
                px="4"
                style={{ fontSize: 14 }}
                textDecoration="underline"
                fontWeight="bold"
              >
                Completed transactions
              </Text>
            </NavLink>
            <NavLink to="/pendingorders">
              <Text
                px="4"
                style={{ fontSize: 14 }}
                textDecoration="underline"
                fontWeight="bold"
              >
                Pending orders
              </Text>
            </NavLink>
          </Stack> */}
        </Stack>
        <Stack>
          <Heading size="md" marginTop="16">
            Trading Balances
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th style={{ textAlign: "center" }}>Asset</Th>
                <Th style={{ textAlign: "center" }}>Current price</Th>
                <Th style={{ textAlign: "center" }}>My balance</Th>
                <Th style={{ textAlign: "center" }}>Value</Th>
                <Th style={{ textAlign: "center" }}>Trading portfolio</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td style={{ textAlign: "center" }}>USD Cash</Td>
                <Td></Td>
                <Td style={{ textAlign: "center" }}>-</Td>
                <Td style={{ textAlign: "center" }}>
                  {toCurrency(cashBalance)}
                </Td>
                <Td style={{ textAlign: "center" }}>-</Td>
                <Td style={{ textAlign: "center" }}>
                  <Progress value={(cashBalance / portfolioValue) * 100} />
                  <Text style={{ fontSize: 14, paddingTop: "3%" }}>
                    {((cashBalance / portfolioValue) * 100).toFixed(0)}%
                  </Text>
                </Td>
              </Tr>
              {assets.map((a) => (
                <TableRow userAsset={a} key={a.asset.productIdentifier} />
              ))}
            </Tbody>
          </Table>
        </Stack>

        <Stack>
          <Heading size="md" marginTop="16">
            Order History
          </Heading>
          <OrderTable type={"completed"} orders={orders} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Portfolio;
