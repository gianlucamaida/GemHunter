import { useSQLiteContext } from "expo-sqlite";
import { Attraction } from "@/constants/Attraction";

export const useDatabase = () => {
  const db = useSQLiteContext(); // Accesso al database tramite il contesto
  console.log(db.databasePath);

  // Funzione per ottenere tutte le attrazioni
  const getAttractions = async (): Promise<Attraction[]> => {
    try {
      const rows = await db.getAllAsync<Attraction>(
        "SELECT id, lat, lon, isGem, icon FROM attractions"
      );
      return rows;
    } catch (error) {
      console.error("Error fetching attractions:", error);
      throw error;
    }
  };

  // Funzione per inserire un'attrazione
  const insertAttraction = async (attraction: Omit<Attraction, "id">): Promise<number> => {
    try {
      const result = await db.runAsync(
        "INSERT INTO attractions (lat, lon, isGem, icon) VALUES (?, ?, ?, ?)",
        [attraction.lat, attraction.lon, attraction.isGem, attraction.icon]
      );
      return result.lastInsertRowId; // Restituisce l'ID dell'ultima riga inserita
    } catch (error) {
      console.error("Error inserting attraction:", error);
      throw error;
    }
  };

  return {
    getAttractions,
    insertAttraction,
  };
};
