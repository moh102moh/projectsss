import admin from "../firebase.js";

export async function sendNotification(token, title, body) {
  if (!token) return;

  const message = {
    token,
    notification: { title, body },
  };

  try {
    await admin.messaging().send(message);
  } catch (err) {
    console.log("FCM Error:", err.message);
  }
}
