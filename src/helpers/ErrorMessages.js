// utils/errorMessage.js
export const getErrorMessage = (error, action = "complete this action", user = null) => {
  console.log(error);
  switch (error?.code) {
    case 401:
      return user ? `You do not have permission to ${action}.` : `You must be logged in to ${action}.`;
    case 403:
      return `You do not have permission to ${action}.`;
    case 404:
      return "The message(s) could not be found. They may have already been deleted.";
    case 409:
      return "A conflict occurred. Please refresh and try again.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "The server encountered an error. Please try again later.";
    default:
      return `Unable to ${action}. Please try again.`;
  }
};
