import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import rateLimit from "@/utils/ratelimit";


const sendResponse = (res, statusCode, data, error = null) => {
  if (error) {
    console.error(error);
    res.status(statusCode).json({ error: error.message || "An unexpected error occurred" });
  } else {
    res.status(statusCode).json(data);
  }
};

const isValidInput = (body, requiredFields) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      return false;
    }
  }
  return true;
};

export default async function handler(req, res) {
  try {
    await rateLimit(req, res);

  }
  catch (error) {
    return;
  }

  let db;
  try {
    const connection = await connectToDatabase();
    db = connection.db;
  } catch (error) {
    return sendResponse(res, 500, null, new Error("Failed to connect to database"));
  }

  switch (req.method) {
    case "GET":
      try {
        const tasks = await db.collection("tasks").find({}).toArray();
        sendResponse(res, 200, tasks);
      } catch (error) {
        sendResponse(res, 500, null, error);
      }
      break;

    case "POST":
      try {
        const { title, description, status } = req.body;
        if (!isValidInput(req.body, ["title", "description", "status"])) {
          throw new Error("Missing required fields");
        }
        const result = await db.collection("tasks").insertOne({ title, description, status });
        const task = await db.collection("tasks").findOne({ _id: result.insertedId });
        sendResponse(res, 201, task);
      } catch (error) {
        sendResponse(res, 500, null, error);
      }
      break;

    case "PUT":
      try {
        const { _id, ...updates } = req.body;
        if (!ObjectId.isValid(_id)) throw new Error("Invalid ID format");
        await db.collection("tasks").updateOne({ _id: new ObjectId(_id) }, { $set: updates });
        const updatedTask = await db.collection("tasks").findOne({ _id: new ObjectId(_id) });
        sendResponse(res, 200, updatedTask);
      } catch (error) {
        sendResponse(res, 500, null, error);
      }
      break;

    case "DELETE":
      try {
        const { _id } = req.body;
        if (!ObjectId.isValid(_id)) throw new Error("Invalid ID format");
        await db.collection("tasks").deleteOne({ _id: new ObjectId(_id) });
        sendResponse(res, 200, { _id });
      } catch (error) {
        sendResponse(res, 500, null, error);
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
