import { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite/next";
import migrations from "./migrations/migrations";
import { DBContextType } from "./provider";

const expoDb = openDatabaseSync("tendrel.main", {
  enableChangeListener: true,
});
const db = drizzle(expoDb);

export const initialize = (): Promise<DBContextType> => {
  return Promise.resolve({ db, expoDb });
};

export const useMigrationHelper = () => {
  return useMigrations(db as ExpoSQLiteDatabase, migrations);
};
