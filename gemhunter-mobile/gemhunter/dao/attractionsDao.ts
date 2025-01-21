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

export { getAttractions };
