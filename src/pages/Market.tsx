import React, { FC, useContext, useEffect, useState } from "react";
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
import { Asset, AssetDetails } from "../index.d";
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
        <Button>View details</Button>
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
  const { allAssets, portfolioValue } = useContext(UserContext);

  const [tableFilter, setTableFilter] = useState<TableFilter>("All");

  const [assetRows, setAssetRows] = useState<Asset[]>([]);
  /**
   * Updates the assets array with the most recent trade price
   * then inserts into rows
   */
  useEffect(() => {
    /**
     * Code extracted to function to prevent DRY violation
     * Sets the data for each row of the table
     * @param assets An array of Asset objects
     */
    const updateRows = (assets: Array<Asset>) => {
      if (tableFilter === "Recently Added") {
        setAssetRows([...assets].sort(sortRecentlyAdded));
      } else if (tableFilter === "Top Traded") {
        setAssetRows([...assets].sort(sortTopTraded));
      } else if (tableFilter === "Top Movers") {
        setAssetRows([...assets].sort(sortTopMovers));
      } else {
        setAssetRows([...assets].sort(sortAll));
      }
    };

    /**
     * Gets additional price data for each row from the server
     */
    const fetchRowUpdates = async () => {
      if (!allAssets) {
        updateRows([]);
      } else {
        // get latest price data for each asset
        let promises: Array<Promise<AssetDetails>> = [];
        allAssets.forEach((asset) => {
          const promise = assetApi.getAssetData(asset.productIdentifier);
          promises.push(promise);
        });
        // wait for all promises to resolve before continuing
        const transformedAssets = await Promise.all(promises);
        // update each asset with most recent price action
        const modifiedAssets: Array<Asset> = transformedAssets.map(
          (assetDetails: AssetDetails) => {
            // If the asset has not been traded there is no price
            if (!assetDetails.priceEvents.length) return assetDetails.asset;
            // Otherwise update the asset with last price action and return
            let newAsset: Asset = assetDetails.asset;
            const lastPriceIndex = assetDetails.priceEvents.length - 1;
            newAsset.lastPriceAction =
              assetDetails.priceEvents[lastPriceIndex].price;
            return newAsset;
          }
        );
        updateRows(modifiedAssets);
      }
    };
    fetchRowUpdates();
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
          <Table variant="simple">
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
          </Table>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Market;
