import "server-only";
import { Db, MongoClient } from "mongodb";
import { getEnv } from "./env";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoDb?: Db;
};

export async function getDb() {
  if (!globalForMongo.mongoDb) {
    globalForMongo.mongoClient ??= new MongoClient(getEnv().mongoUri);
    await globalForMongo.mongoClient.connect();
    globalForMongo.mongoDb = globalForMongo.mongoClient.db();
  }
  return globalForMongo.mongoDb;
}
