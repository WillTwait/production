import {
  Environment,
  type FetchFunction,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";
import type RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

let environment: RelayModernEnvironment;

export function createClientSideEnvironment(url: string | URL) {
  console.log("create client side environment", url);
  environment ||= new Environment({
    network: Network.create(fetchFn(url)),
    store: new Store(new RecordSource()),
    log: event => console.log(event),
  });

  return environment;
}

function fetchFn(url: string | URL): FetchFunction {
  return (operation, variables) => {
    const response = fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        "x-tendrel-user": process.env.EXPO_PUBLIC_X_TENDREL_USER ?? "",
      },
      body: JSON.stringify({
        query: operation.text,
        variables: variables ?? {},
      }),
    });
    return Observable.from(response.then(data => data.json()));
  };
}
