import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { initialize } from "./tendrel";

import { TendrelClient } from "@tendrel/sdk";

type ContextType = { tendrel: TendrelClient | null };

export const TendrelContext = React.createContext<ContextType>({ tendrel: null });

export const useTendrel = () => useContext(TendrelContext);

export function TendrelProvider({ children }: PropsWithChildren) {
  const [tendrel, setTendrel] = useState<TendrelClient | null>(null);

  useEffect(() => {
    if (tendrel) return;
    initialize().then(async t => {
      const res = await t?.ping();

      // Temporary, just here as proof we can talk to Tendrel!
      if (res?.pong === 200) {
        console.log("Established connection to Tendrel");
      } else {
        console.log("Failed to establish connection to Tendrel");
      }
      setTendrel(t);
    });
  }, []);

  return <TendrelContext.Provider value={{ tendrel }}>{children}</TendrelContext.Provider>;
}
