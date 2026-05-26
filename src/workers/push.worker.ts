import { initPush } from "../../config/push.config";
import pushQueue from "../queues/push.queue";
import webpush from 'web-push';
import { deletePushSubscription, findPushSubscriptions } from "../service/push-subscription.service";
import { findUsers } from "../service/user.service";
import log from '../logger';

initPush();

pushQueue.process(async (job) => {
  try {
    const businessId = job.data.business?.toString?.();
    const payload = JSON.stringify(job.data.data || {});

    if (!businessId || !job.data.data) {
      log.warn(`push job ${job.id} missing required fields`);
      return;
    }

    let subscriptions: any[] = await findPushSubscriptions({
      businesses: { $in: [businessId] }
    });

    // Fallback for old subscriptions not yet linked to businesses.
    if (!subscriptions || subscriptions.length === 0) {
      const businessUsers: any[] = await findUsers(
        { 'businesses.business': businessId },
        ''
      );

      const businessUserIds = businessUsers.map((user: any) => user._id);
      subscriptions = businessUserIds.length > 0
        ? await findPushSubscriptions({ userId: { $in: businessUserIds } })
        : [];
    }

    if (!subscriptions || subscriptions.length === 0) {
      log.info(`No push subscriptions found for business ${businessId}`);
      return;
    }

    let sentCount = 0;
    for (const subscriptionDoc of subscriptions) {
      const subscription = (subscriptionDoc as any).subscription;
      if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
        continue;
      }

      try {
        await webpush.sendNotification(subscription, payload);
        sentCount++;
      } catch (error: any) {
        // Remove stale/expired subscriptions to reduce recurring failures.
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await deletePushSubscription({
            'subscription.endpoint': subscription.endpoint
          });
          continue;
        }

        throw error;
      }
    }

    log.info(`push notification sent to ${sentCount} subscriber(s) for business ${businessId}`);
    
  } catch (error) {
     log.error(`push notification failed for ${job.data.business}: `, error);
    throw error; 
  }
});