import getDatabase from "@/hooks/useDatabase";

const getAttractions = async () => {
  try {
    const db = await getDatabase();
    const sql = "SELECT * FROM attractions";
    const result = await db.getAllAsync(sql, []);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const setFound = async (id: number) => {
  try {
    const db = await getDatabase();
    const sql = "UPDATE attractions SET isFound = 1 WHERE id = ?";
    await db.runAsync(sql, [id]);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getAttractions, setFound };
