import type { providerQuery } from "@/__generated__/providerQuery.graphql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { z } from "zod";

const ORG_ASYNC_STORAGE_KEY = "CURRENT_USER_ORG";

const Organization = z.object({
  id: z.string(),
  name: z.string(),
});

type Organization = z.infer<typeof Organization>;

const TendrelUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string(),
});

type TendrelUser = z.infer<typeof TendrelUser>;

type ContextType = {
  user: TendrelUser;
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

export function TendrelProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganizationState] = useState<Organization | null>(
    null,
  );
  const [_loading, setLoading] = useState(false);

  const data = useLazyLoadQuery<providerQuery>(
    graphql`
      query providerQuery {
        user {
          firstName
          lastName
          displayName
          organizations(withApp: [Checklist]) {
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

  function setOrganization(newOrg: Organization) {
    void AsyncStorage.setItem(ORG_ASYNC_STORAGE_KEY, JSON.stringify(newOrg));
    setOrganizationState(newOrg);
  }

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
        organizations: data.user.organizations.edges.map(org => {
          return { name: org.node.name.value, id: org.node.id };
        }),
        setOrganization: setOrganization,
        currentOrganization: organization,
        user: {
          displayName: data.user.displayName,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
