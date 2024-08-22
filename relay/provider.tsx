import { RelayEnvironmentProvider } from "react-relay";
import { createClientSideEnvironment } from "./environment";

interface RelayProviderProps extends React.PropsWithChildren {
  getToken: () => Promise<string | null>;
  url?: string | URL;
}

export function RelayProvider({ children, getToken, url }: RelayProviderProps) {
  const environment = createClientSideEnvironment({
    getToken,
    url: url ?? (process.env.EXPO_PUBLIC_TENDREL_GRAPHQL_URL as string),
  });
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
