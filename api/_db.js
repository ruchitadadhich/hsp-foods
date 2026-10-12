import { MongoClient } from "mongodb";

let client;
// Reuse the connection between requests (important on serverless)
export async function getCol() {
  if (!process.env.MONGODB_URI) throw new Error("setup");
  if (!client) client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db("hspfoods").collection("store");
}
