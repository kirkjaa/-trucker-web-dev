/**
 * Firebase Cloud Messaging is temporarily disabled for the demo deployment.
 * This hook returns stable defaults so the rest of the application continues
 * to work without any Firebase configuration.
 */
const useFcmToken = () => {
  return {
    token: "",
    notificationPermissionStatus: "disabled",
  };
};

export default useFcmToken;
