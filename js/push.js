const webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BOIH646NXjWMKuB1q_tvkd0Zz74APYkZY07U5Hy-lCxRMfB5DvIk9ekAYQgzGoPxVeTQbHCa88QBcUdLIVYDPRM",
   "privateKey": "7ubdJpXPKATA39Znw9LWm8J-WMUZrzKY9eCOs-aInIo"
};

webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cDTNDpCCiso:APA91bHmznOHMK5e0Ou1lovGBmI0S-K2th4Ebu8KEW2F8I7g5sEjJ6eiJo-ZjdD4S1zwNnROlBcjQoonE2yF6lUtCvxuTFs8dSFFtPxxGpGvLWlCVrRxF0FZB6oJnF72aeZXxq5KLzsq",
   "keys": {
      "p256dh": "BGlah0Vz7Y5jb6opohpk9k7zGwf0S0oLHwXE6xAuKFxXENmH0IG0Z7WsgGVW3Vxl4GAJEVdqqdhxtwc2W5ZRc8Y=",
      "auth": "Nudk6ZCjln7516ql2S96Yw=="
   }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
   gcmAPIKey: '782035806925',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);