# Push Notifications (Vibration and Sound)

This API sends Web Push payloads from Bull workers. Devices can vibrate on supported platforms when the service worker passes notification options to `showNotification`.

## Important Limits

- Vibration: supported on many Android browsers and installed PWAs.
- Custom notification sound: generally **not supported** for background Web Push.
- Browser/OS settings (silent mode, DND, disabled notification sounds) always take priority.

## Backend Payload Shape

Push jobs include:

- `title`
- `body`
- `url`
- Optional options: `tag`, `renotify`, `requireInteraction`, `vibrate`, `timestamp`, `icon`, `badge`, `image`, `silent`

Example payload emitted by worker:

```json
{
  "title": "New Order Received",
  "body": "Your business has received a new order",
  "url": "https://business.example.com/business/orders/123",
  "tag": "order-123",
  "renotify": true,
  "requireInteraction": true,
  "vibrate": [200, 100, 200, 100, 300],
  "timestamp": 1716712800000
}
```

## Service Worker (Required)

Your frontend service worker must map this payload to `showNotification` options.

```javascript
self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = { title: 'Notification', body: 'You have a new update', url: '/' };
  }

  const title = payload.title || 'Notification';
  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    image: payload.image,
    tag: payload.tag,
    renotify: payload.renotify,
    requireInteraction: payload.requireInteraction,
    silent: payload.silent,
    vibrate: payload.vibrate,
    timestamp: payload.timestamp,
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
```

## Foreground Audio Alternative

If you need custom sounds, play audio only when your web app is open and active. Background push does not reliably allow custom sound files.
