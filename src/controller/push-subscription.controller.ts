import { Request, Response } from "express";
import { get } from "lodash";
import * as response from '../responses'
import { createPushSubscription, deletePushSubscription, findPushSubscription } from "../service/push-subscription.service";

const buildSubscriptionFilter = (req: Request, userId: string) => {
    const query: any = req.query || {}
    const filter: any = {
        userId
    }

    if (query.endpoint) {
        filter['subscription.endpoint'] = query.endpoint
    }

    return filter
}

export const createPushSubscriptionHandler = async (req: Request, res: Response) => {
    try {
        const subscription = req.body.subscription
        const device = req.body.device
        if (!subscription || !subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
            return response.badRequest(res, { message: 'invalid subscription object', objectReceived: req.body })
        };


        const userId = get(req, 'user._id')
        if (!userId) {
            return response.unAuthorized(res, { message: 'invalid session' })
        }

        const currentBusinessId = req.currentBusiness?._id?.toString?.();
        const newSubscription = await createPushSubscription(userId, subscription, currentBusinessId, device)
      
        return response.created(res, {message: 'subscribed successfully', subscription: newSubscription})
        
    } catch (error) {
        return response.error(res, error)
    }
}

export const getPushSubscriptionHandler = async (req: Request, res: Response) => {
    try {
        const userId = get(req, 'user._id')
        if (!userId) {
            return response.unAuthorized(res, { message: 'invalid session' })
        }

        const filter = buildSubscriptionFilter(req, userId)
        const subscription = await findPushSubscription(filter)

        if (!subscription) {
            return response.notFound(res, { message: 'subscription not found' })
        }

        return response.ok(res, { subscription })
    } catch (error) {
        return response.error(res, error)
    }
}

export const deletePushSubscriptionHandler = async (req: Request, res: Response) => {
    try {
        const userId = get(req, 'user._id')
        if (!userId) {
            return response.unAuthorized(res, { message: 'invalid session' })
        }

        const filter = buildSubscriptionFilter(req, userId)
        const deleted = await deletePushSubscription(filter)

        if (!deleted || deleted.deletedCount === 0) {
            return response.notFound(res, { message: 'subscription not found' })
        }

        return response.ok(res, { message: 'subscription deleted successfully' })
    } catch (error) {
        return response.error(res, error)
    }
}