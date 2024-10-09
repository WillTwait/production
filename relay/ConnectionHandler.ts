// @see https://github.com/facebook/relay/issues/1861

import {
  ConnectionHandler,
  type RecordProxy,
  type Variables,
  getRelayHandleKey,
} from "relay-runtime";
import type {
  HandleFieldPayload,
  ReadOnlyRecordProxy,
  RecordSourceProxy,
} from "relay-runtime/lib/store/RelayStoreTypes";
import { getStableStorageKey } from "relay-runtime/lib/store/RelayStoreUtils";

const CONNECTION_HANDLE_KEYS = "__connectionHandleKeys";

function update(store: RecordSourceProxy, payload: HandleFieldPayload) {
  ConnectionHandler.update(store, payload);
  // HACK
  const [handleName] = payload.handleKey.split("(");
  const record = store.get(payload.dataID);

  const prevHandleKeys: Record<string, unknown> | undefined = record?.getValue(
    CONNECTION_HANDLE_KEYS,
    { handleName },
    // biome-ignore lint/suspicious/noExplicitAny:
  ) as any;
  const nextHandleKeys = {
    ...(prevHandleKeys ?? {}),
    [payload.handleKey]: payload.args,
  };

  // FIXME: The RecordProxy API doesn't let us set objects as values.
  // We bypass this restriction by reaching into internals.
  // biome-ignore lint/suspicious/noExplicitAny:
  const mutator: any = (record as any)._mutator;

  mutator.setValue(
    record?.getDataID(),
    getStableStorageKey(CONNECTION_HANDLE_KEYS, { handleName }),
    nextHandleKeys,
  );
}

function getConnections(
  record: ReadOnlyRecordProxy,
  key: string,
  filter?: (variables: Variables) => boolean,
): Array<RecordProxy> {
  const handleName = getRelayHandleKey("connection", key, null);
  const handleKeys: Record<string, Variables> | undefined = record.getValue(
    CONNECTION_HANDLE_KEYS,
    {
      handleName,
    },
    // biome-ignore lint/suspicious/noExplicitAny:
  ) as any;

  if (!handleKeys) return [];

  return Object.entries(handleKeys).flatMap(([handleKey, args]) => {
    if (filter && filter(args) === false) return [];
    const cx = record.getLinkedRecord(handleKey);
    return cx ?? [];
  });
}

export default {
  ...ConnectionHandler,
  update,
  getConnections,
};
