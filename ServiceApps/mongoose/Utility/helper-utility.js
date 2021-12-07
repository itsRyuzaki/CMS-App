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

export const getDueAmount = (fees, paidAmount) => {
  let totalFees = 0;
  fees.forEach((fee) => {
    totalFees += fee.value;
  });
  paidAmount.forEach((amount) => {
    totalFees -= amount.value;
  });
  return totalFees;
};
