export const toastNotification = ({ title, description, status }: any) => {
  // Implement your toast notification logic
  console.log(`Toast Notification: ${title} - ${description} - ${status}`);
};

export const sendNativeNotification = ({ title, body }: any) => {
  // Implement your native notification logic
  console.log(`Native Notification: ${title} - ${body}`);
};
