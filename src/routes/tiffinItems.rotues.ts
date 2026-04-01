import express from "express";
import { Request, Response } from "express";
import { db } from "../db/index";
import { daily_tiffin_items, daily_tiffin, menu_items } from "../db/schema";
import { eq } from "drizzle-orm";
import { today } from "../utils/date";
const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    try {

        const result = await db.select({
            id: menu_items.id,
            name: menu_items.name,
            description: menu_items.description,
            price: menu_items.price,
            image_url: menu_items.image_url,
            tiffin_id: daily_tiffin.id,
        }).from(daily_tiffin)
          .innerJoin(daily_tiffin_items, eq(daily_tiffin.id, daily_tiffin_items.daily_tiffin_id))
          .innerJoin(menu_items, eq(menu_items.id, daily_tiffin_items.menu_item_id))
          .where(eq(daily_tiffin.date, today));

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { selected_items } = req.body;

        if (!Array.isArray(selected_items) || selected_items.length === 0) {
            return res.status(400).json({ error: "Invalid items" });
        }


        const result = await db.transaction(async (tx) => {
            let tiffinId: number;

            const existing = await tx
                .select()
                .from(daily_tiffin)
                .where(eq(daily_tiffin.date, today));

            if (existing.length === 0) {
                const [newTiffin] = await tx
                    .insert(daily_tiffin)
                    .values({ date: today })
                    .returning();

                tiffinId = newTiffin.id;
            } else {
                tiffinId = existing[0].id;
            }

            await tx.insert(daily_tiffin_items).values(
                selected_items.map((item: number) => ({
                    daily_tiffin_id: tiffinId,
                    menu_item_id: Number(item),
                }))
            );

            return { tiffinId };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { selected_items } = req.body;


    const tiffinId = Number(id);
    
    if (!tiffinId || isNaN(tiffinId)) {
      return res.status(400).json({ error: "Invalid tiffin ID" });
    }

    
    if (!Array.isArray(selected_items) || selected_items.length === 0) {
      return res.status(400).json({ error: "Invalid items" });
    }

    const uniqueItems = [...new Set(selected_items.map((i: any) => Number(i)))];

    const result = await db.transaction(async (tx) => {
      const existingTiffin = await tx
        .select()
        .from(daily_tiffin)
        .where(eq(daily_tiffin.id, tiffinId));

      if (existingTiffin.length === 0) {
        throw new Error("TIFFIN_NOT_FOUND");
      }

      
      await tx
        .delete(daily_tiffin_items)
        .where(eq(daily_tiffin_items.daily_tiffin_id, tiffinId));


      await tx.insert(daily_tiffin_items).values(
        uniqueItems.map((itemId: number) => ({
          daily_tiffin_id: tiffinId,
          menu_item_id: itemId,
        }))
      );

      return { tiffinId, items: uniqueItems };
    });

    return res.status(200).json({
      message: "Tiffin updated successfully",
      data: result,
    });

  } catch (error: any) {
    console.error("Update error:", error);

    if (error.message === "TIFFIN_NOT_FOUND") {
      return res.status(404).json({ error: "Tiffin not found" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;