import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "ap-south-1",
  endpoint: "https://s3.ap-south-1.amazonaws.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
