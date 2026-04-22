import webpush from 'web-push';

let isInitialized = false;

export const initPush = () => {
  if (isInitialized) return;

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  isInitialized = true;
};