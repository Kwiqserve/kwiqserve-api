import { initPush } from "../../config/push.config";
import pushQueue from "../queues/push.queue";
import { findPushSubscription } from "../service/push-subscription.service";
import log from '../logger';

initPush();

pushQueue.process(async (job) => {
  try {
    // check if the business is subscribed to push notifications
    const subscription = await findPushSubscription({_id: job.data.business})
    if(subscription){
      // send notifications if they're subscribed
    }
    
  } catch (error) {
     log.error(`push notification failed for ${job.data.business}: `, error);
    throw error; 
  }
});