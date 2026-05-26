import PushSubscription from '../model/push-subscription.model';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { PushSubscriptionDocument } from '../model/push-subscription.model';

export async function createPushSubscription(userId: string, subscription: any) {
    console.log('creating/updating push subscription for user', userId, 'with subscription', subscription)
    return PushSubscription.updateOne(
        {
            userId,
            "subscription.endpoint": subscription.endpoint
        },
        {
            $set: { subscription },
            $setOnInsert: { userId }
        },
        { upsert: true }
    )
}

export async function findPushSubscription(
    query: FilterQuery<PushSubscriptionDocument>,
    options: QueryOptions = { lean: true }
) {
    return PushSubscription.findOne(query, {}, options)
}

export async function findPushSubscriptions(
    query: FilterQuery<PushSubscriptionDocument>,
    options: QueryOptions = { lean: true }
) {
    return PushSubscription.find(query, {}, options)
}

export async function findAndUpdatePushSubscription(
    query: FilterQuery<PushSubscriptionDocument>,
    update: UpdateQuery<PushSubscriptionDocument>,
    options: QueryOptions
) {
    return PushSubscription.findOneAndUpdate(query, update, options)
}

export async function deletePushSubscription(
    query: FilterQuery<PushSubscriptionDocument>
) {
    return PushSubscription.deleteOne(query)
}