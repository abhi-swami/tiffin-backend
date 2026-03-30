import express from "express";
import { Request, Response } from "express";
import { db } from "../db/index";
import { daily_tiffin_items, daily_tiffin, menu_items } from "../db/schema";
import { eq } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";

const router = express.Router();

router.post("/", async(req:Request,res:Response)=>{
    try{
        let selecteMenuItems:number[] = [];
        let tiffinId:number = 0

        const {selected_items} = req.body;
        const presentDate = new Date().toISOString().split('T')[0];

        const isTodaysTiffinPresent = await db.select().from(daily_tiffin).where(eq(daily_tiffin.date, presentDate));

        if(isTodaysTiffinPresent.length == 0){
            const newTiffin = await db.insert(daily_tiffin).values({date:presentDate}).returning();
            tiffinId = newTiffin[0].id;
        }else{
            tiffinId = isTodaysTiffinPresent[0].id;
        }
        console.log("Tiffin present for today:", isTodaysTiffinPresent);


        
        selected_items.forEach(async (item:number)=>{
            let menuItemId = Number(item);
            let response = await db.insert(daily_tiffin_items).values({daily_tiffin_id:tiffinId, menu_item_id:menuItemId}).returning();
            console.log("Inserted tiffin item:", response);
        })

        res.json(isTodaysTiffinPresent);
    }
    catch(error){
        res.status(500).json({ error: "Internal Server Error" });   
    }
})


export default router;