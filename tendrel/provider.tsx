import type { TendrelClient } from "@tendrel/sdk";
import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { initialize } from "./tendrel";

type ContextType = { tendrel: TendrelClient };

const Context = React.createContext<ContextType | null>(null);

export const useTendrel = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useTendrel() called without a TendrelProvider");
  }
  return ctx;
};

export function TendrelProvider({ children }: PropsWithChildren) {
  const [tendrel, setTendrel] = useState<TendrelClient | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hmm...?
  useEffect(() => {
    if (tendrel) return;
    initialize()
      .then(async t => {
        try {
          const res = await t?.ping();

          // Temporary, just here as proof we can talk to Tendrel!
          if (res?.pong === 200) {
            console.log("Established connection to Tendrel");
          } else {
            console.log("Failed to establish connection to Tendrel");
          }
        } catch (e) {
          console.log(e);
        }
        setTendrel(t);
      })
      .catch(e => console.error("Initialization failed", e));
  }, []);

  if (!tendrel) return null;

  return <Context.Provider value={{ tendrel }}>{children}</Context.Provider>;
}
