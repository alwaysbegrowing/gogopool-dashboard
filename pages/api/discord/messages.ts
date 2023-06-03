import { MongoClient, WithId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const componentFilter = (search?: string) => {
  if (!search || search === "") return {};
  return {
    "message.components": {
      $elemMatch: {
        components: {
          $elemMatch: {
            "data.url": {
              $regex: search,
              $options: "i",
            },
          },
        },
      },
    },
  };
};

type Data = {
  results: WithId<Record<string, unknown>>[];
  count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const owner = (req.query.owner || "") as string;
  const page = parseInt((req.query.page || "1") as string);
  const limit = parseInt((req.query.limit || "10") as string);
  const uri = process.env.MONGODB_URI || "";
  const client = new MongoClient(uri, {});
  const db = client.db("gogopool");

  const filter = componentFilter(owner);
  const count = await db.collection("events").countDocuments(filter);
  const results = await db
    .collection("events")
    .find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  await client.close();
  res.status(200).json({ results, count });
}
