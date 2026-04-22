
import Bull from 'bull';
import { BusinessDocument } from '../model/business.model';
import { UserDocument } from '../model/user.model';

// Initialize the queue with Redis
const pushQueue = new Bull('qrCodeQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Function to add a slack message job to the queue
export const sendPushJob = (messageData: { 
    business: BusinessDocument['_id']
    user?: UserDocument['_id']
    data: {
        title: string
        body: string
        url: string
        // businessFrontUrl: string
    } 
}) => {
    pushQueue.add(messageData, {
        attempts: 3, // retry 3 times if job fails
        backoff: {
            delay: 5000,
            type: 'exponential'
        }, // wait 5 seconds before retrying
        removeOnComplete: 1000, // Keep the last 1000 completed jobs
        removeOnFail: 100, // Keep the last 100 failed jobs for review
    });
};

export default pushQueue;
