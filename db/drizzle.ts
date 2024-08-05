import { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite/next";
import migrations from "./migrations/migrations";

const expoDb = openDatabaseSync("tendrel.main", {
  enableChangeListener: true,
});
const db = drizzle(expoDb);

export const initialize = () => {
  return Promise.resolve({ db, expoDb });
};

export const useMigrationHelper = () => {
  return useMigrations(db as ExpoSQLiteDatabase, migrations);
};
