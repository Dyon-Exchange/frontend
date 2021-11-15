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
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { toCurrency } from "../formatting";
import { Asset } from "../index.d";

const ChangeCell = ({ change }: { change: number }) => {
  const red = "#FF0000";
  const green = "#90EE90";
  const black = "#000000";
  let prelude = "";
  let color = "";

  if (change > 0) {
    color = green;
    prelude = "+";
  } else if (change < 0) {
    color = red;
  } else {
    color = black;
  }

  return (
    <Td style={{ color, fontWeight: "bold" }}>
      {change && `${prelude}${change}%`}
    </Td>
  );
};

/**
 * Table row component for Market
 */
const TableRow = ({ asset }: { asset: Asset }) => {
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${asset.productIdentifier}`);
  };

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <Td>
        <chakra.img src={asset.image} style={{ height: 50, width: 50 }} />
      </Td>
      <Td>
        {asset.name} {asset.year}
      </Td>
      <Td>{asset.sell && `${toCurrency(asset.sell)}`}</Td>
      <Td>{asset.buy && `${toCurrency(asset.buy)}`}</Td>
      <ChangeCell change={asset.changePercentage} />
      <Td>
        <Button>View details</Button>
      </Td>
    </Tr>
  );
};

type TableFilter = "All" | "Top Movers" | "Recently Added" | "Top Traded";

const TableHeaderButton = ({
  filter,
  func,
  currentFilter,
}: {
  filter: TableFilter;
  func: Function;
  currentFilter: TableFilter;
}) => (
  <Button
    px="5"
    mx="5"
    backgroundColor={filter === currentFilter ? "black" : undefined}
    color={filter === currentFilter ? "white" : undefined}
    onClick={() => func(filter)}
  >
    {filter}
  </Button>
);

const Market = () => {
  const { allAssets, portfolioValue } = useContext(UserContext);

  const [tableFilter, setTableFilter] = useState<TableFilter>("All");

  const [assetRows, setAssetRows] = useState<Asset[]>([]);

  const sortRecentlyAdded = (a: Asset, b: Asset) =>
    a.createdAt < b.createdAt ? 1 : -1;

  const sortTopTraded = (a: Asset, b: Asset) => (a.volume < b.volume ? 1 : -1);

  const sortTopMovers = (a: Asset, b: Asset) =>
    a.changePercentage < b.changePercentage ? 1 : -1;

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
                <Th />
                <Th />
                <Th>Sell</Th>
                <Th>Buy</Th>
                <Th>Change</Th>
                <Th />
                <Th />
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
