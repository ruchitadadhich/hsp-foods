let client;
// Reuse the connection between requests (important on serverless)
export async function getCol() {
  if (!process.env.MONGODB_URI) throw new Error("setup");
  if (!client) {
    const { MongoClient } = await import("mongodb"); // loaded here so a problem is caught and logged, not a crash
    client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  }
  await client.connect();
  return client.db("hspfoods").collection("store");
}