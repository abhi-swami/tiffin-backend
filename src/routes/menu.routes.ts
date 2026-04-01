import express from "express";

const router = express.Router();
import { Request, Response } from "express";
import { db } from "../db";
import { daily_tiffin, daily_tiffin_items, menu_items } from "../db/schema";
import { eq } from "drizzle-orm";
import { today } from "../utils/date";

router.get("/",async(req:Request, res:Response)=>{
    try{
       let result = await db.select({
            id: menu_items.id,
            name: menu_items.name,
            description: menu_items.description,
            price: menu_items.price,
            image_url: menu_items.image_url,
            tiffin_id: daily_tiffin.id,
        }).from(daily_tiffin)
        .innerJoin(daily_tiffin_items,eq(daily_tiffin.id,daily_tiffin_items.daily_tiffin_id))
        .innerJoin(menu_items,eq(daily_tiffin_items.menu_item_id,menu_items.id))
        .where(eq(daily_tiffin.date, today));
        
        // let response = await db.select().from(daily_tiffin)

        // console.log("Menu Items:", response);
       res.status(200).json(result);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;