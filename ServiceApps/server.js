import express from "express";
import jsonServer from "json-server";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ENDPOINT_CONFIG } from "./mongoose/Config/endpoint-config.js";
import {
  defaultClinicData,
  defaultUserData,
} from "./mongoose/Config/global-config.js";
import { CategoryModel } from "./mongoose/Models/category-model.js";
import { ClinicModel } from "./mongoose/Models/clinic-model.js";
import { MedicalDetailModel } from "./mongoose/Models/medical-detail-model.js";
import { PatientModel } from "./mongoose/Models/patient-model.js";
import { PaymentDetailModel } from "./mongoose/Models/payment-detail.js";
import { UserModel } from "./mongoose/Models/user-model.js";
import { crudUtil } from "./mongoose/Utility/crud-utility.js";
import { getDueAmount } from "./mongoose/Utility/helper-utility.js";

const app = express();
mongoose.connect("mongodb://localhost:27017/CMS-App-DB");

const port = 3636;

app.use(jsonServer.bodyParser);

app.use((req, res, next) => {
  // To allow cross domain-request from Testing Client
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  // For CORS resource verification.
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// middleware for adding logs
app.use(function (req, res, next) {
  console.log();
  console.log("--------------xxxxxxx---------------");
  console.log("REQUEST METHOD: ", req.method);
  console.log("REQUEST URL: ", req.url);
  next();
});

/**
 * Middleware for global error handling
 */
app.use(function (err, req, res, next) {
  console.error(err.stack);
  let response = {
    errorDetails: err,
  };
  res.status(500).send(response);
});

/**
 * Sample route for checking server status
 */
app.get("/", (req, res) => {
  res.send("CMS Backend Server running...");
});

/**
 * Get user details if no user present then create using default value
 */
app.get(ENDPOINT_CONFIG.getUser, async (req, res) => {
  try {
    let userResponse = await crudUtil.findAll(
      { name: defaultUserData.name },
      null,
      null,
      UserModel
    );

    // First time logging in
    if (userResponse.errorDetails !== null || userResponse.data.length === 0) {
      console.log("First time login. Creating a default user");
      let clinicId = uuidv4();
      let userId = uuidv4();
      const clinicData = {
        clinicId: clinicId,
        userId: userId,
        ...defaultClinicData,
      };

      const userData = {
        userId: userId,
        ...defaultUserData,
        selectedClinicId: clinicId,
      };

      await crudUtil.create(clinicData, ClinicModel);
      await crudUtil.create(userData, UserModel);

      userResponse = {
        data: [userData],
        errorDetails: null,
      };
    }
    res.send(userResponse);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Add new clinic details
 */
app.post(ENDPOINT_CONFIG.addClinic, async (req, res) => {
  try {
    let clinicId = uuidv4();
    req.body["clinicId"] = clinicId;
    let clinicResponse = await crudUtil.create(req.body, ClinicModel);

    if (clinicResponse.errorDetails !== null) {
      res.send(420);
    } else {
      clinicResponse["data"] = {
        clinicId: clinicId,
      };
    }

    res.send(clinicResponse);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Get Clinic Details
 */
app.post(ENDPOINT_CONFIG.getClinics, async (req, res) => {
  try {
    const response = await crudUtil.findAll(
      req.body.filter,
      req.body.projection,
      req.body.queryOptions,
      ClinicModel
    );
    if (response.errorDetails !== null) {
      res.status(420);
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Add new patient details (+ medical and payment details)
 */
app.post(ENDPOINT_CONFIG.addPatientDetails, async (req, res) => {
  try {
    const response = {
      data: {},
      errorDetails: [],
    };
    const uniqueId = uuidv4();

    const dueAmount = getDueAmount(req.body.newPaymentDetails.transactions);

    req.body.patientDetails["patientId"] = uniqueId;
    req.body.medicalDetails["patientId"] = uniqueId;

    req.body.patientDetails["pendingAmount"] = dueAmount;

    console.log(uniqueId);

    const patientResponse = await crudUtil.create(
      req.body.patientDetails,
      PatientModel
    );
    if (patientResponse.errorDetails !== null) {
      response.errorDetails.push(patientResponse.errorDetails);
    }

    const medicalResponse = await crudUtil.create(
      req.body.medicalDetails,
      MedicalDetailModel
    );

    if (medicalResponse.errorDetails !== null) {
      response.errorDetails.push(medicalResponse.errorDetails);
    }

    if (dueAmount > 0) {
      req.body.newPaymentDetails["patientId"] = uniqueId;
      req.body.newPaymentDetails["dueAmount"] = dueAmount;
      const newPaymentResponse = await crudUtil.create(
        req.body.newPaymentDetails,
        PaymentDetailModel
      );
      if (newPaymentResponse.errorDetails !== null) {
        response.errorDetails.push(newPaymentResponse.errorDetails);
      }
    }

    if (response.errorDetails.length !== 0) {
      res.status(420);
    } else {
      response.data = {
        patientId: uniqueId,
      };
      res.send(response);
    }
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Update patient details (+ medical and payment details)
 */
app.post(ENDPOINT_CONFIG.updatePatientDetails, async (req, res) => {
  try {
    let response = {
      data: {
        patientId: req.body.patientId,
      },
      errorDetails: [],
    };

    let newDueAmount = 0;
    let oldDueAmount = 0;

    let oldPaymentDetails = req.body.oldPaymentDetails;

    // During update need to update pendingAmount with updated values
    // Loose comparison for undefined as well
    if (oldPaymentDetails == null) {
      const oldPaymentResposne = await crudUtil.findAll(
        { patientId: req.body.patientId },
        {},
        {},
        PaymentDetailModel
      );
      oldPaymentDetails = oldPaymentResposne.data;
    }

    // this will always be true
    if (oldPaymentDetails) {
      if (req.body.newPaymentDetails) {
        newDueAmount = getDueAmount(req.body.newPaymentDetails.transactions);

        const index = oldPaymentDetails.findIndex((details) => {
          return details.categoryId === req.body.newPaymentDetails.categoryId;
        });
        // Payment added for already present index
        // Add in old details and reset new one.
        if (index !== -1) {
          oldPaymentDetails[index].transactions.push(
            req.body.newPaymentDetails.transactions[0]
          );
          req.body.newPaymentDetails = null;
          newDueAmount = 0;
        }
      }
      oldPaymentDetails.forEach((detail) => {
        detail["dueAmount"] = getDueAmount(detail.transactions);
        oldDueAmount += detail.dueAmount;
      });
    }
    if (req.body["patientDetails"]) {
      req.body.patientDetails["pendingAmount"] = newDueAmount + oldDueAmount;

      let patientResponse = await crudUtil.updateOne(
        { patientId: req.body.patientId },
        req.body.patientDetails,
        PatientModel
      );

      if (patientResponse.errorDetails !== null) {
        res.status(420);
        response.errorDetails.push(patientResponse.errorDetails);
      }
    }

    if (req.body.medicalDetails) {
      req.body.medicalDetails["patientId"] = req.body.patientId;
      let medicalResponse = await crudUtil.create(
        req.body.medicalDetails,
        MedicalDetailModel
      );
      if (medicalResponse.errorDetails !== null) {
        res.status(420);
        response.errorDetails.push(medicalResponse.errorDetails);
      }
    }

    if (req.body.newPaymentDetails && newDueAmount > 0) {
      req.body.newPaymentDetails["dueAmount"] = newDueAmount;
      req.body.newPaymentDetails["patientId"] = req.body.patientId;
      let newPaymentResponse = await crudUtil.create(
        req.body.newPaymentDetails,
        PaymentDetailModel
      );
      if (newPaymentResponse.errorDetails !== null) {
        res.status(420);
        response.errorDetails.push(newPaymentResponse.errorDetails);
      }
    }

    if (oldPaymentDetails) {
      for (const oldPaymentDetail of oldPaymentDetails) {
        let oldPaymentResponse = {};
        let due = getDueAmount(oldPaymentDetail.transactions);
        if (due <= 0) {
          console.log("Deleting completed payment details");
          oldPaymentResponse = await crudUtil.deleteOne(
            {
              patientId: req.body.patientId,
              categoryId: oldPaymentDetail.categoryId,
            },
            PaymentDetailModel
          );
        } else {
          console.log("Updating previous payment details");
          oldPaymentDetail["dueAmount"] = due;
          oldPaymentResponse = await crudUtil.updateOne(
            {
              patientId: req.body.patientId,
              categoryId: oldPaymentDetail.categoryId,
            },
            oldPaymentDetail,
            PaymentDetailModel
          );
        }
        if (oldPaymentResponse.errorDetails !== null) {
          res.status(420);
          response.errorDetails.push(oldPaymentResponse.errorDetails);
        }
      }
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Get patient list based on request filter
 * Can be used for single patient details as well
 */
app.post(ENDPOINT_CONFIG.getPatients, async (req, res) => {
  try {
    const response = await crudUtil.findAll(
      req.body.filter,
      req.body.projection,
      req.body.queryOptions,
      PatientModel
    );
    if (response.errorDetails !== null) {
      res.status(420);
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Get payment records (+ patient details if page type is pending)
 */
app.post(ENDPOINT_CONFIG.paymentRecords, async (req, res) => {
  try {
    let response = { errorDetails: [] };
    // Get all payments with due amount
    let paymentRecords = await crudUtil.findAll(
      req.body.filter,
      req.body.projection,
      req.body.queryOptions,
      PaymentDetailModel
    );
    if (paymentRecords.errorDetails !== null) {
      response.errorDetails.push(paymentRecords.errorDetails);
      res.status(420);
    } else if (req.body.pageType === "PENDING") {
      // Get patient Details
      const patientIds = Array.from(
        new Set(paymentRecords.data.map((x) => x.patientId))
      );
      const condition = { patientId: { $in: patientIds } };
      const patientDetails = await crudUtil.findAll(
        condition,
        null,
        null,
        PatientModel
      );
      if (patientDetails.errorDetails !== null) {
        response.errorDetails.push(patientDetails.errorDetails);
        res.status(420);
      } else {
        response["patientDetails"] = patientDetails.data;
      }
    }
    response["paymentRecords"] = paymentRecords.data;
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Get medical records (+ patient details if page type is follow up)
 */
app.post(ENDPOINT_CONFIG.medicalRecords, async (req, res) => {
  try {
    let response = { errorDetails: [] };
    // Get all medical records with follow up date greater than today's date
    let medicalRecords = await crudUtil.findAll(
      req.body.filter,
      req.body.projection,
      req.body.queryOptions,
      MedicalDetailModel
    );
    if (medicalRecords.errorDetails !== null) {
      response.errorDetails.push(medicalRecords.errorDetails);
      res.status(420);
    } else if (req.body.pageType === "FOLLOW-UP") {
      // Get patient Details
      const patientIds = Array.from(
        new Set(medicalRecords.data.map((x) => x.patientId))
      );
      const condition = { patientId: { $in: patientIds } };
      const patientDetails = await crudUtil.findAll(
        condition,
        null,
        null,
        PatientModel
      );
      if (patientDetails.errorDetails !== null) {
        response.errorDetails.push(patientDetails.errorDetails);
        res.status(420);
      } else {
        response["patientDetails"] = patientDetails.data;
      }
    }
    response["medicalRecords"] = medicalRecords.data;
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Add new disease category
 */
app.post(ENDPOINT_CONFIG.addCategory, async (req, res) => {
  try {
    const uniqueId = uuidv4();
    req.body["categoryId"] = uniqueId;
    let response = await crudUtil.create(req.body, CategoryModel);
    if (response.errorDetails !== null) {
      res.status(420);
    } else {
      response["data"] = req.body;
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

/**
 * Get all category details
 */
app.post(ENDPOINT_CONFIG.getCategories, async (req, res) => {
  try {
    let response = await crudUtil.findAll(
      req.body.filter,
      null,
      null,
      CategoryModel
    );
    if (response.errorDetails !== null) {
      res.status(420);
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      errorDetails: "Some unknown error occured!!",
    };
    console.log("Some unknown error occured!!");
    res.status(500).send(response);
  }
});

app.listen(port, () => {
  console.log();
  console.log(`Backend Server running on http://127.0.0.1:${port}`);
  console.log("Current Date and Time:");
  console.log(new Date());
});
