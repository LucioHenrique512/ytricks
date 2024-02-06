"use client";

import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren } from "react";
import { ContextProvider } from "./context";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <NextUIProvider>
      <ContextProvider>{children}</ContextProvider>
    </NextUIProvider>
  );
};

export default Providers;
