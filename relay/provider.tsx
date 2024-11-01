import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createClientSideEnvironment } from "./environment";

interface RelayProviderProps extends React.PropsWithChildren {
  url?: string | URL;
}

export function RelayProvider({ children, url }: RelayProviderProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const environment = useMemo(() => {
    return createClientSideEnvironment({
      getToken: getToken,
      url: url ?? (process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL as string),
    });
  }, [getToken, url]);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
