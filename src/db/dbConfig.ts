import mongoose from "mongoose";
import { GridFSBucket, Db } from "mongodb";

let bucket: GridFSBucket | null = null;

export const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("connected");

      bucket = new GridFSBucket(connection.db as Db, { bucketName: "uploads" });
    });
    connection.on("error", (err) => {
      console.log("error" + err);
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBucket = () => {
  if (!bucket) throw new Error("GridFSBucket is not initialized");
  return bucket;
};
