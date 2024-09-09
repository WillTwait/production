import type {
  providerQuery,
  providerQuery$data,
} from "@/__generated__/providerQuery.graphql";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TendrelClient } from "@tendrel/sdk";

import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { z } from "zod";
import { initialize } from "./tendrel";

const ORG_ASYNC_STORAGE_KEY = "CURRENT_USER_ORG";

const Organization = z.object({
  id: z.string(),
  name: z.string(),
});

type Organization = z.infer<typeof Organization>;

type ContextType = {
  tendrel: TendrelClient;
  currentOrganization: Organization | null;
  setOrganization(newOrg: Organization): void;
  organizations: Organization[];
};

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
  const [organization, setOrganizationState] = useState<Organization | null>(
    null,
  );

  const { isSignedIn } = useAuth();
  const [_loading, setLoading] = useState(false);

  if (!isSignedIn) {
    return null;
  }

  const data = useLazyLoadQuery<providerQuery>(
    graphql`
      query providerQuery {
        user {
          organizations {
            edges {
              node {
                id
                name {
                  value
                }
              }
            }
          }
        }
      }
    `,
    {},
  );

  // load the preference from AsyncStorage on app launch
  //FIXME: check if existing org is one of the ones for the user signing in, if not clear it
  useEffect(() => {
    const load = async () => {
      const storedOrg = await AsyncStorage.getItem(ORG_ASYNC_STORAGE_KEY);

      console.log(storedOrg);

      if (storedOrg) {
        const parsedOrg = Organization.safeParse(JSON.parse(storedOrg));
        if (parsedOrg.success) {
          setOrganization(parsedOrg.data);
        }
      }
      setLoading(false);
    };

    void load();
  }, []);

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

  function setOrganization(newOrg: Organization) {
    void AsyncStorage.setItem(ORG_ASYNC_STORAGE_KEY, JSON.stringify(newOrg));
    setOrganizationState(newOrg);
  }

  if (!tendrel) return null;

  if (data.user.organizations.edges.length === 1 && organization === null) {
    const org = data.user.organizations.edges[0];
    const onlyOneOrg: Organization = {
      name: org.node.name.value,
      id: org.node.id,
    };
    setOrganization(onlyOneOrg);
  }

  return (
    <Context.Provider
      value={{
        tendrel: tendrel,
        organizations: data.user.organizations.edges.map(org => {
          return { name: org.node.name.value, id: org.node.id };
        }),
        setOrganization: setOrganization,
        currentOrganization: organization,
      }}
    >
      {children}
    </Context.Provider>
  );
}
