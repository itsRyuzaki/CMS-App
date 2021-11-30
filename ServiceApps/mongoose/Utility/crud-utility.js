const generateErrorDetails = (response, err) => {
  response["errorDetails"] = {
    code: 500,
    description: "",
    logs: err,
  };
};

/**
 * CRUD Utility for mongoose
 */
export const crudUtil = {
  create: async (requestBody, model) => {
    let response = {
      errorDetails: null,
    };

    try {
      await model.create(requestBody);
    } catch (err) {
      generateErrorDetails(response, err);
    }

    return response;
  },
  read: async (condition, projection, queryOptions, model) => {
    let response = {
      data: null,
      errorDetails: null,
    };

    let defaultprojection = {
      _id: 0,
      __v: 0,
      ...projection,
    };

    try {
      response.data = await model
        .find(condition, defaultprojection, queryOptions)
        .lean();
    } catch (err) {
      generateErrorDetails(response, err);
    }
    return response;
  },
  updateOne: async (condition, updatedObj, model) => {
    let response = {
      data: null,
      errorDetails: null,
    };

    try {
      response.data = await model.updateOne(condition, updatedObj);
    } catch (err) {
      generateErrorDetails(response, err);
    }
    return response;
  },
  deleteOne: async (condition, model) => {
    let response = {
      data: null,
      errorDetails: null,
    };

    try {
      response.data = await model.deleteOne(condition);
    } catch (err) {
      generateErrorDetails(response, err);
    }
    return response;
  },
};
