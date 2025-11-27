// import { Injectable } from "@nestjs/common";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// @Injectable()
// export class S3Service {
//   private s3 = new S3Client({
//     region: "us-west-1",
//     endpoint: "https://s3.us-west-1.idrivee2.com",
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY!,
//       secretAccessKey: process.env.S3_SECRET_KEY!,
//     },
//     forcePathStyle: true,
//   });

//   private bucket = process.env.S3_BUCKET!;

//   async upload(file: Express.Multer.File) {
//     const key = `products/${Date.now()}-${file.originalname}`;
//     await this.s3.send(new PutObjectCommand({
//       Bucket: this.bucket,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     }));
//     return `https://${this.bucket}.s3.us-west-1.idrivee2.com/${key}`;
//   }
// }
