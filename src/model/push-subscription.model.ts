import mongoose from 'mongoose';
import { Schema } from "mongoose";

import { UserDocument } from "./user.model";
import { BusinessDocument } from './business.model';

export interface PushSubscriptionDocument {
    user: UserDocument['_id']
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    businesses: BusinessDocument['_id'][]
    device: {
        browser: string
        os: string
    }
}

const PushSubscriptionSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    subscription: {
        endpoint: { 
            type: String, 
            required: true 
        },
        keys: {
            p256dh: { 
                type: String, 
                required: true 
            },
            auth: { 
                type: String, 
                required: true 
            }
        }
    },
    businesses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Business' 
    }],
    device: {
        browser: {
            type: String
        },
        os: {
            type: String
        }
    }
}, { timestamps: true });

const PushSubscription = mongoose.model<PushSubscriptionDocument>('PushSubscription', PushSubscriptionSchema);

export default PushSubscription;