import React, { useContext, useEffect, useState } from "react";
import { HStack, VStack, Heading, Box, Flex } from "@chakra-ui/layout";
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
import { NavLink } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Asset } from "../index.d";

const TableRow = (props: { asset: Asset }) => {
  return (
    <Tr>
      <Td>
        <chakra.img
          src={props.asset.image}
          {...props}
          style={{ height: 50, width: 50 }}
        />
      </Td>
      <Td>
        {props.asset.name} {props.asset.year}
      </Td>
      <Td>$130.01</Td>
      <Td>$152.01</Td>
      <Td>+10.23%</Td>
      <Td>+15.38%</Td>
      <Td>
        <NavLink to={`/asset/${props.asset.productIdentifier}`}>
          <Button>View details</Button>
        </NavLink>
      </Td>
    </Tr>
  );
};

type TableFilter = "All" | "Top Movers" | "Recently added" | "Top traded";

const TableHeaderButton = (props: {
  filter: TableFilter;
  func: Function;
  currentFilter: TableFilter;
}) => {
  return (
    <Button
      px="5"
      mx="5"
      backgroundColor={
        props.filter === props.currentFilter ? "black" : undefined
      }
      color={props.filter === props.currentFilter ? "white" : undefined}
      onClick={() => props.func(props.filter)}
    >
      {props.filter}
    </Button>
  );
};

const Market = () => {
  const { assets } = useContext(UserContext);

  const [tableFilter, setTableFilter] = useState<TableFilter>("All");

  const [assetRows, setAssetRows] = useState<Asset[]>([]);

  useEffect(() => {
    if (tableFilter === "Recently added") {
      setAssetRows(assets.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
    } else {
      setAssetRows(assets);
    }
  }, [tableFilter, assets]);

  return (
    <Flex flexDirection="row">
      <VStack px="10" py="10" alignItems="flex-start">
        <Heading size="md">My Portfolio</Heading>
        <HStack>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            ${Number(9908032).toLocaleString()}
          </Text>
          <Text>USD</Text>
        </HStack>
        <Text style={{ color: "red" }}>-$2,877.12 (-3.40%)</Text>

        <NavLink
          to="/portfolio"
          style={{ alignSelf: "center", paddingTop: "10px" }}
        >
          <Button>View my portfolio</Button>
        </NavLink>
      </VStack>

      <VStack py="10" alignContent="center">
        <HStack width="100%">
          <TableHeaderButton
            filter="All"
            currentFilter={tableFilter}
            func={setTableFilter}
          />
          <TableHeaderButton
            filter="Top Movers"
            currentFilter={tableFilter}
            func={setTableFilter}
          />
          <TableHeaderButton
            filter="Recently added"
            currentFilter={tableFilter}
            func={setTableFilter}
          />
          <TableHeaderButton
            filter="Top traded"
            currentFilter={tableFilter}
            func={setTableFilter}
          />
        </HStack>
        <Box py="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th>Sell</Th>
                <Th>Buy</Th>
                <Th>Change</Th>
                <Th>Change</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {assetRows.map((a) => (
                <TableRow asset={a} key={a.productIdentifier} />
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Market;
