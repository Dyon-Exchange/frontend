import { Table } from "@chakra-ui/react";
import React, { FC } from "react";

const BaseTable: FC = ({ children }) => (
  <Table variant={"striped"} size={"sm"}>
    {children}
  </Table>
);

export default BaseTable;
