import { Table } from "@chakra-ui/react";
import React from "react";

const BaseTable: React.FC = ({ children }) => (
  <Table variant={"striped"} size={"sm"}>
    {children}
  </Table>
);

export default BaseTable;
