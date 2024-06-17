import { Request, Response } from "express";
import { WebhookModel } from "../models/webhook";

export const postWebhook = async (req: Request, res: Response) => {
    try {
        const { webhook } = req.body;
        if (!webhook) {
            return res.status(400).send({ message: "Webhook is required." });
        }

        const newWebhook = new WebhookModel({
            webhook
        });

        await newWebhook.save();

        res.status(201).send({ message: "Webhook saved successfully." });
    } catch (error) {
        console.error("Error saving webhook:", error);
        res.status(500).send({ message: "Internal server error." });
    }
};
