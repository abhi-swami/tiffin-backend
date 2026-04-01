import express  from 'express';
import { Request, Response } from 'express';
import { db } from '../db/index';
import { menu_items } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get("/", async(req: Request, res: Response) => {
    try {
        const menuItems = await db.select().from(menu_items);
        // console.log("Fetched menu items:", menuItems);
        res.status(200).json(menuItems);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", async(req: Request, res: Response) => {
    try {
        const { name, description } = req.body;      
        const newMenuItem = await db.insert(menu_items).values({ name, description }).returning();
        // console.log("Created new menu item:", newMenuItem);
        res.status(201).json(newMenuItem);
    } catch (error) {
        console.error("Error creating menu item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 


router.put("/:id", async (req:Request,res:Response)=>{
    try{
        const {id } = req.params;
        const { name, description } = req.body;
        const updatedMenuItem = await db.update(menu_items).set({name,description}).where(eq(menu_items.id, Number(id))).returning();
        // console.log("Updated menu item:", updatedMenuItem);
        res.status(200).json(updatedMenuItem);
    }catch(error){
        console.error("Error updating menu item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.delete("/:id", async (req:Request,res:Response)=>{    
    try{
        const {id} = req.params;
        const deletedMenuItem = await db.delete(menu_items).where(eq(menu_items.id,Number(id))).returning();
        console.log("Deleted menu item:", deletedMenuItem);
        res.status(200).json(deletedMenuItem);
    }catch(error){
        console.error("Error deleting menu item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;