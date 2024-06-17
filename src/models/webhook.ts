import mongoose from 'mongoose';

const WebhookSchema = new mongoose.Schema({
    webhook: { type: String, required: true },
});

export const WebhookModel = mongoose.model('Webhook', WebhookSchema);
