import { JsonDB, Config } from "node-json-db";
import { promises as fs } from "fs";

class JsonDBWrapper {
  public db: JsonDB;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.db = new JsonDB(new Config(this.dbPath, true, true, "/"));
    this.initDb();
  }

  private async initDb() {
    try {
      // Try to read the file to check if it exists and has valid JSON
      await fs.readFile(this.dbPath, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file doesn't exist, initialize it with default data
        console.log(
          "JSON file not found, creating new file with default content."
        );
        await this.push("/email", ""); // Initialize the file with default structure
      } else {
        // Log other errors that might occur
        console.error(
          "An unexpected error occurred while initializing the JSON DB:",
          error
        );
      }
    }
  }

  public async push(path: string, data: any) {
    await this.db.push(path, data);
  }

  public async get(path: string) {
    return await this.db.getData(path);
  }

  public getDbPath() {
    return this.dbPath;
  }
}

export default JsonDBWrapper;
