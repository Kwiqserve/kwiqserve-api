import { object, string, ref, array, number } from "yup";

export const createPushSubscriptionSchema = object({
    body: object({
        subscription: object({
            endpoint: string().required('subscription.endpoint is required'),
            keys: object({
                p256dh: string().required('subscription.keys.p256dh is required'),
                auth: string().required('subscription.keys.auth is required')
            }).required('subscription.keys is required')
        }).required('subscription is required'),
    })
});

// export const getPushSubscriptionSchema = object({
//     query: object({
//         endpoint: string()          
//         }).required('subscription is required'),
//     })
// });