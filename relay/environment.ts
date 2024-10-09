import {
  Environment,
  type FetchFunction,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";
import { RelayDefaultHandlerProvider } from "relay-runtime/lib/handlers/RelayDefaultHandlerProvider";
import type RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import ConnectionHandler from "./ConnectionHandler";

let environment: RelayModernEnvironment;

export function createClientSideEnvironment(opts: FetchFunctionOptions) {
  console.log("create client side environment", opts.url);
  environment ||= new Environment({
    network: Network.create(fetchFn(opts)),
    store: new Store(new RecordSource()),
    // log: console.log,
    handlerProvider(handle) {
      if (handle === "connection") {
        return ConnectionHandler;
      }
      return RelayDefaultHandlerProvider(handle);
    },
  });

  return environment;
}

interface FetchFunctionOptions {
  getToken: () => Promise<string | null>;
  url: string | URL;
}

function fetchFn({ getToken, url }: FetchFunctionOptions): FetchFunction {
  return (operation, variables) => {
    const response = getToken().then(token =>
      fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {
          authorization: token ?? "",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: operation.text,
          variables: variables ?? {},
        }),
      }),
    );
    return Observable.from(response.then(data => data.json()));
  };
}
