import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import type { SQLiteDatabase } from "expo-sqlite";
import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Database } from "sql.js";
import { initialize } from "./drizzle";

export type DBContextType = {
  db: SQLJsDatabase | ExpoSQLiteDatabase | null;
  expoDb: Database | SQLiteDatabase | null;
};

export const DatabaseContext = React.createContext<DBContextType>({
  db: null,
  expoDb: null,
});

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLJsDatabase | ExpoSQLiteDatabase | null>(null);

  // Only used for drizzle studio
  const [expoDb, setExpoDb] = useState<SQLiteDatabase | Database | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (db) return;
    initialize().then(res => {
      setDb(res.db);
      setExpoDb(res.expoDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, expoDb }}>
      {children}
    </DatabaseContext.Provider>
  );
}
