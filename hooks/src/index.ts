import express from "express"
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req,res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log("recahed here 0");

    await client.$transaction(async tx => {
        console.log("recahed here 1");
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
            
        });
        console.log("recahed here 2");

        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        })
    })
    console.log("recahed here 3");
    res.json({
        message:"webhook received"
    })
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});