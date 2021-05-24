import React from "react";
import { chakra, ImageProps, forwardRef } from "@chakra-ui/react";
import logo from "../assets/Dyon_logo.svg";

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  return (
    <chakra.img
      src={logo}
      ref={ref}
      {...props}
      style={{ height: 150, width: 150 }}
    />
  );
});
