import express from "express";
import path from "node:path";
import { Response } from "express";
import multer from "multer";
import {db} from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UserRequest } from "../utils/interfaces";
import { s3Client } from "../config/s3";
import { awsS3Bucket } from "../utils/envVariables";

const router = express.Router();    
const upload = multer({ storage: multer.memoryStorage() });

const getUploadedFile = (files: UserRequest["files"]) => {
    if (!files || Array.isArray(files)) {
        return undefined;
    }

    return files.profile_image?.[0] ?? files.avatar?.[0] ?? files.file?.[0];
};


router.get("/",async(req:UserRequest,res:Response)=>{
    try{
        const profileId = req.session.userId;
        if(!profileId){
            return res.status(400).json({error:"Profile ID is required"});
        }
        if(typeof profileId !== "string"){  
            return res.status(400).json({error:"Invalid Profile ID"});
        }

        const profile= await db.select().from(users).where(eq(users.id, profileId));

        if(profile.length === 0){
            return res.status(404).json({error:"Profile not found"});
        }

        console.log("Profile retrieved:", profile[0]);

        return res.status(200).json({message:"Profile retrieved successfully",profile});


    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.put(
    "/",
    upload.fields([
        { name: "profile_image", maxCount: 1 },
        { name: "avatar", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    async(req:UserRequest,res:Response)=>{
    try{
        const profileId = req.session.userId;
        if(!profileId){
            return res.status(400).json({error:"Profile ID is required"});
        }

        const uploadedFile =
            req.file ??
            getUploadedFile(req.files);

        const { first_name, last_name, email } = (req.body ?? {}) as {
            first_name?: string;
            last_name?: string;
            email?: string;
        };

        const updates: Partial<typeof users.$inferInsert> = {};

        if (typeof first_name === "string") {
            updates.first_name = first_name.trim();
        }

        if (typeof last_name === "string") {
            updates.last_name = last_name.trim();
        }

        if (typeof email === "string") {
            updates.email = email.trim();
        }

        if (uploadedFile) {
            if (!awsS3Bucket) {
                return res.status(500).json({ error: "S3 bucket configuration is missing" });
            }

            const extension = typeof uploadedFile.originalname === "string" ? path.extname(uploadedFile.originalname) : ".jpg";
            const fileKey = `profile-images/${profileId}/${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: awsS3Bucket,
                    Key: fileKey,
                    Body: uploadedFile.buffer,
                    ContentType: uploadedFile.mimetype,
                })
            );

            updates.profile_image = `https://s3.ap-south-1.amazonaws.com/${awsS3Bucket}/${fileKey}`;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No profile fields provided" });
        }

        const updatedProfile = await db
            .update(users)
            .set(updates)
            .where(eq(users.id, profileId))
            .returning({
                id: users.id,
                phone: users.phone,
                email: users.email,
                first_name: users.first_name,
                last_name: users.last_name,
                profile_image: users.profile_image,
            });

        if (updatedProfile.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.status(200).json({
            message:"Profile updated successfully",
            profile: updatedProfile[0],
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
