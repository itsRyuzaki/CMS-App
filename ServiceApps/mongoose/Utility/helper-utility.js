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

export const getDueAmount = (transactions) => {
  let totalFees = 0;
  transactions.forEach((transaction) => {
    totalFees += transaction.fees;
    totalFees -= transaction.paidAmount;
  });
  return totalFees;
};
