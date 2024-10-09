import { useAuth } from "@clerk/clerk-expo";
import { RelayEnvironmentProvider } from "react-relay";
import { createClientSideEnvironment } from "./environment";

interface RelayProviderProps extends React.PropsWithChildren {
  url?: string | URL;
}

export function RelayProvider({ children, url }: RelayProviderProps) {
  const auth = useAuth();

  if (!auth.isLoaded || !auth.isSignedIn) {
    return null;
  }

  const environment = createClientSideEnvironment({
    getToken: auth.getToken,
    url: url ?? (process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL as string),
  });

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
