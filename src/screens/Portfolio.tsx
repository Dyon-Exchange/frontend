import { Heading, VStack, Text, Box } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Progress,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { toCurrency } from "../formatting";
import { UserAsset } from "../index.d";

const TableRow = ({ userAsset }: { userAsset: UserAsset }) => {
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${userAsset.asset.productIdentifier}`);
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
          src={userAsset.asset.image}
        />
      </Td>
      <Td style={{ textAlign: "center" }}>
        {userAsset.asset.name} {userAsset.asset.year}
      </Td>
      <Td style={{ textAlign: "center" }}>
        {userAsset.asset.askMarketPrice &&
          toCurrency(userAsset.asset.askMarketPrice)}
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Text>{userAsset.quantity}</Text>
        <Text>
          {userAsset.asset.askMarketPrice &&
            toCurrency(userAsset.asset.askMarketPrice * userAsset.quantity)}
        </Text>
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Progress value={userAsset.portfolioShare} />
        <Text style={{ fontSize: 14, paddingTop: "3%" }}>
          {userAsset.portfolioShare && userAsset.portfolioShare.toFixed(0)}%
        </Text>
      </Td>
    </Tr>
  );
};

const Portfolio = () => {
  const { cashBalance, assets, portfolioValue } = useContext(UserContext);

  return (
    <VStack spacing="15px" py="10">
      <Box style={{ width: "65%", paddingLeft: "5%" }}>
        <Heading size="lg">My portfolio</Heading>
        <Text py="2" style={{ fontSize: 30 }}>
          {toCurrency(portfolioValue)}
        </Text>
        <Box style={{ background: "#D3D3D3", width: "40%", borderRadius: 10 }}>
          <Text py="3%" px="5%" style={{ fontWeight: "bold" }}>
            Quick links
          </Text>
          <NavLink to="/completedorders">
            <Text py="1%" px="5%" style={{ fontSize: 14 }}>
              Completed transactions
            </Text>
          </NavLink>
          <NavLink to="/pendingorders">
            <Text pb="3%" px="5%" style={{ fontSize: 14 }}>
              Pending orders
            </Text>
          </NavLink>
        </Box>
      </Box>

      <Box
        style={{
          width: "65%",
          paddingLeft: "5%",
          marginTop: "2%",
        }}
      >
        <Heading size="lg">Balances</Heading>
        <Box py="10">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th />
                <Th style={{ textAlign: "center" }}>Asset</Th>
                <Th style={{ textAlign: "center" }}>Current price</Th>
                <Th style={{ textAlign: "center" }}>My balance</Th>
                <Th style={{ textAlign: "center" }}>Trading portfolio</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td style={{ textAlign: "center" }}>USD Cash</Td>
                <Td />
                <Td />
                <Td style={{ textAlign: "center" }}>
                  {toCurrency(cashBalance)}
                </Td>
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
        </Box>
      </Box>
    </VStack>
  );
};

export default Portfolio;
