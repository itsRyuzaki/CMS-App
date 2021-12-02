/**
 * Helper Utility
 */

export const generateErrorDetails = (response, err) => {
  console.log(err);
  response["errorDetails"] = {
    model: "",
    description: "",
    logs: err,
  };
};
