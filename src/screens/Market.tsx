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
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Asset } from "../index.d";
import { toCurrency } from "../formatting";
import Chart from "../components/Chart";
import { data } from "../dummydata";

const ChangeCell = (props: { change: number }) => {
  const red = "#FF0000";
  const green = "#90EE90";
  const black = "#000000";
  let prelude = "";
  let color = "";

  if (props.change > 0) {
    color = green;
    prelude = "+";
  } else if (props.change < 0) {
    color = red;
  } else {
    color = black;
  }

  return (
    <Td style={{ color, fontWeight: "bold" }}>
      {props.change && `${prelude}${props.change}%`}
    </Td>
  );
};

const TableRow = (props: { asset: Asset }) => {
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${props.asset.productIdentifier}`);
  };

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
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
      <Td>{props.asset.sell && `${toCurrency(props.asset.sell)}`}</Td>
      <Td>{props.asset.buy && `${toCurrency(props.asset.buy)}`}</Td>
      <ChangeCell change={props.asset.changePercentage} />
      <Td>
        <Button>View details</Button>
      </Td>
    </Tr>
  );
};

type TableFilter = "All" | "Top Movers" | "Recently Added" | "Top Traded";

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
  const { allAssets, portfolioValue } = useContext(UserContext);

  const [tableFilter, setTableFilter] = useState<TableFilter>("All");

  const [assetRows, setAssetRows] = useState<Asset[]>([]);

  const sortRecentlyAdded = (a: Asset, b: Asset) => {
    return a.createdAt < b.createdAt ? 1 : -1;
  };

  const sortTopTraded = (a: Asset, b: Asset) => {
    return a.volume < b.volume ? 1 : -1;
  };

  const sortTopMovers = (a: Asset, b: Asset) => {
    return a.changePercentage < b.changePercentage ? 1 : -1;
  };

  const sortAll = (a: Asset, b: Asset) => {
    if (a.name > b.name) return 1;
    return -1;
  };

  useEffect(() => {
    if (tableFilter === "Recently Added") {
      setAssetRows([...allAssets].sort(sortRecentlyAdded));
    } else if (tableFilter === "Top Traded") {
      setAssetRows([...allAssets].sort(sortTopTraded));
    } else if (tableFilter === "Top Movers") {
      setAssetRows([...allAssets].sort(sortTopMovers));
    } else {
      setAssetRows([...allAssets].sort(sortAll));
    }
  }, [tableFilter, allAssets]);

  return (
    <Flex flexDirection="row" justifyContent="center">
      <VStack px="10" py="10" alignItems="flex-start">
        <Heading size="md">My Portfolio</Heading>
        <HStack>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {toCurrency(portfolioValue)}
          </Text>
          <Text>USD</Text>
        </HStack>
        {/* <Text style={{ color: "red" }}>-$2,877.12 (-3.40%)</Text> */}
        <NavLink
          to="/portfolio"
          style={{ alignSelf: "center", paddingTop: "10px" }}
        >
          <Button>View my portfolio</Button>
        </NavLink>
        <Heading size="md" paddingTop="15px">
          Portfolio Value
        </Heading>
        <Chart data={data} noLegend />
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
            filter="Recently Added"
            currentFilter={tableFilter}
            func={setTableFilter}
          />
          <TableHeaderButton
            filter="Top Traded"
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
                <Th></Th>
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
