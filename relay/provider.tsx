import { RelayEnvironmentProvider } from "react-relay";
import { createClientSideEnvironment } from "./environment";

interface RelayProviderProps extends React.PropsWithChildren {
  url?: string | URL;
}

export function RelayProvider({ children, url }: RelayProviderProps) {
  const environment = createClientSideEnvironment(
    url ?? (process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL as string),
  );
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
