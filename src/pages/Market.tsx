import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { HStack, VStack, Heading, Box, Flex } from "@chakra-ui/layout";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  chakra,
  Text,
  Tfoot,
} from "@chakra-ui/react";
import { flatten } from "lodash";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Asset } from "../index.d";
import { toCurrency } from "../formatting";
import Chart from "../components/Chart";
import { data } from "../dummydata";
import { determineContractSize } from "../helpers/determineContractSize";
import assetApi from "../api/asset";
import {
  sortAll,
  sortRecentlyAdded,
  sortTopMovers,
  sortTopTraded,
} from "../helpers/sorting";
import { useInfiniteQuery } from "react-query";
import BaseTable from "../components/common/BaseTable";

interface ChangeCellProps {
  change: number;
}

const ChangeCell: FC<ChangeCellProps> = ({ change }) => {
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

interface TableRowProps {
  asset: Asset;
}

const TableRow: FC<TableRowProps> = (props) => {
  const { asset } = props;
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/asset/${asset.productIdentifier}`);
  };

  const contractSize = determineContractSize(asset.productIdentifier);

  return (
    <Tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <Td>
        <chakra.img
          src={asset.image}
          {...props}
          style={{ height: 50, width: 50 }}
        />
      </Td>
      <Td>
        {asset.name} {asset.year}
      </Td>
      <Td>{contractSize}</Td>
      <Td>{asset.lastPriceAction && `${toCurrency(asset.lastPriceAction)}`}</Td>
      <ChangeCell change={asset.changePercentage} />
      <Td>
        <Button variant="ghost">View details</Button>
      </Td>
    </Tr>
  );
};

type TableFilter = "All" | "Top Movers" | "Recently Added" | "Top Traded";

interface TableHeaderButtonProps {
  filter: TableFilter;
  func: Function;
  currentFilter: TableFilter;
}

const TableHeaderButton: FC<TableHeaderButtonProps> = ({
  filter,
  func,
  currentFilter,
}) => {
  return (
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
};

const Market = () => {
  const {
    data: unformattedAssets,
    isLoading: isAssetsLoading,
    refetch: refetchAssets,
    isFetching: isAssetsFetching,
    fetchNextPage,
  } = useInfiniteQuery("all-assets", assetApi.get, {
    getNextPageParam: (prevPage: any, pages) => prevPage.nextStart,
  });

  const [allLoaded, setAllLoaded] = useState<boolean>(false);

  const assets = useMemo(() => {
    if (!unformattedAssets) return [];
    const assets = flatten(
      unformattedAssets.pages.map((page: any) => page.assets)
    );

    // check if there are more yet to be loaded
    const total = unformattedAssets.pages[0].total;

    const allLoaded = assets.length === total;
    if (allLoaded) setAllLoaded(true);
    return assets;
  }, [unformattedAssets]);

  const { portfolioValue } = useContext(UserContext);

  const [tableFilter, setTableFilter] = useState<TableFilter>("All");

  const [assetRows, setAssetRows] = useState<Asset[]>([]);
  /**
   * Updates the assets array with the most recent trade price
   * then inserts into rows
   */
  useEffect(() => {
    if (!assets) setAssetRows([]);

    if (tableFilter === "Recently Added") {
      setAssetRows([...assets].sort(sortRecentlyAdded));
    } else if (tableFilter === "Top Traded") {
      setAssetRows([...assets].sort(sortTopTraded));
    } else if (tableFilter === "Top Movers") {
      setAssetRows([...assets].sort(sortTopMovers));
    } else {
      setAssetRows([...assets].sort(sortAll));
    }
  }, [tableFilter, assets]);

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
        <Chart data={data} legend={false} showGrid={false} />
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
          <BaseTable>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th>Contract Size</Th>
                <Th>Price</Th>
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
            <Tfoot>
              {!allLoaded && (
                <Flex justifyContent="center" alignItems="center">
                  <Button onClick={(e) => fetchNextPage()} opacity="50%">
                    Load more
                  </Button>
                </Flex>
              )}
            </Tfoot>
          </BaseTable>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Market;
