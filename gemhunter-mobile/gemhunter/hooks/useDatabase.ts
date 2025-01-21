import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

const dbPath = `${FileSystem.documentDirectory}gem.db`;

async function copyDatabaseFile() {
  //eliminazione del db
  await FileSystem.deleteAsync(dbPath, { idempotent: true }); // idempotent evita errori se il file non esiste

  const asset = Asset.fromModule(require("../assets/gem.db"));
  await asset.downloadAsync(); // Assicurati che l'asset venga scaricato
  await FileSystem.copyAsync({
    from: asset.localUri ? asset.localUri : "",
    to: dbPath,
  });
}

async function openDatabase() {
  await copyDatabaseFile();
  return await SQLite.openDatabaseAsync("gem.db", undefined, `${FileSystem.documentDirectory}`);
}

const getDatabase = (() => {
  let dbInstance: any = null;

  return async () => {
    if (!dbInstance) {
      dbInstance = await openDatabase();
    }
    return dbInstance;
  };
})();

export default getDatabase;

//nei dao usare -> import getDatabase from './connectionDB';
