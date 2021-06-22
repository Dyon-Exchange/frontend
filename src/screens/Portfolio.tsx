import React, { useContext } from "react";
import { Container, Heading, VStack, Text, Box } from "@chakra-ui/layout";
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
import { UserContext } from "../contexts/UserContext";
import { UserAsset } from "../index.d";

const TableRow = (props: { userAsset: UserAsset }) => {
  return (
    <Tr>
      <Td>
        <chakra.img
          style={{ height: 50, width: 50 }}
          src={props.userAsset.asset.image}
        />
      </Td>
      <Td>
        {props.userAsset.asset.name} {props.userAsset.asset.year}
      </Td>
      <Td>
        {props.userAsset.asset.marketPrice &&
          `$${props.userAsset.asset.marketPrice}`}
      </Td>
      <Td>
        <Text>{props.userAsset.quantity}</Text>
        <Text>
          {props.userAsset.asset.marketPrice &&
            `${
              props.userAsset.asset.marketPrice * props.userAsset.quantity
            } USD`}
        </Text>
      </Td>
      <Td>
        <Progress value={props.userAsset.portfolioShare} />
        <Text style={{ fontSize: 14, paddingTop: "3%" }}>
          {props.userAsset.portfolioShare &&
            props.userAsset.portfolioShare.toFixed(0)}
          %
        </Text>
      </Td>
    </Tr>
  );
};

const Portfolio = () => {
  const { cashBalance, assets, portfolioValue } = useContext(UserContext);

  return (
    <VStack spacing="15px" py="10">
      <Container>
        <Heading size="lg">My portfolio</Heading>
        <Text py="2" style={{ fontSize: 30 }}>
          ${portfolioValue.toLocaleString()}
        </Text>
        <Box style={{ background: "#D3D3D3", width: "40%", borderRadius: 10 }}>
          <Text py="3%" px="5%" style={{ fontWeight: "bold" }}>
            Quick links
          </Text>
          <Text py="1%" px="5%" style={{ fontSize: 14 }}>
            Completed transactions
          </Text>
          <Text pb="3%" px="5%" style={{ fontSize: 14 }}>
            Pending orders
          </Text>
        </Box>
      </Container>

      <VStack py="10" alignContent="center">
        <Heading size="lg">Balances</Heading>

        <Box py="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Asset</Th>
                <Th>Current price</Th>
                <Th>My balance</Th>
                <Th>Trading portfolio</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>US$ Cash</Td>
                <Td></Td>
                <Td></Td>
                <Td>{cashBalance} USD</Td>
                <Td>
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
      </VStack>
    </VStack>
  );
};

export default Portfolio;
