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
});

/**
 * Add new clinic details
 */
app.post(ENDPOINT_CONFIG.addClinic, async (req, res) => {
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
});

/**
 * Get Clinic Details
 */
app.post(ENDPOINT_CONFIG.getClinics, async (req, res) => {
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
});

/**
 * Add new patient details (+ medical and payment details)
 */
app.post(ENDPOINT_CONFIG.addPatientDetails, async (req, res) => {
  const uniqueId = uuidv4();
  req.body.patientDetails["patientId"] = uniqueId;
  req.body.medicalDetails["patientId"] = uniqueId;
  req.body.newPaymentDetails["patientId"] = uniqueId;
  console.log(uniqueId);

  const patientResponse = await crudUtil.create(
    req.body.patientDetails,
    PatientModel
  );
  const medicalResponse = await crudUtil.create(
    req.body.medicalDetails,
    MedicalDetailModel
  );
  const newPaymentResponse = await crudUtil.create(
    req.body.newPaymentDetails,
    PaymentDetailModel
  );

  const response = {
    data: {},
    errorDetails: [],
  };
  if (patientResponse.errorDetails !== null) {
    response.errorDetails.push(patientResponse.errorDetails);
  }
  if (medicalResponse.errorDetails !== null) {
    response.errorDetails.push(medicalResponse.errorDetails);
  }
  if (newPaymentResponse.errorDetails !== null) {
    response.errorDetails.push(newPaymentResponse.errorDetails);
  }

  if (response.errorDetails.length !== 0) {
    res.status(420);
  } else {
    response.data = {
      patientId: uniqueId,
    };
    res.send(response);
  }
});

/**
 * Update patient details (+ medical and payment details)
 */
app.post(ENDPOINT_CONFIG.updatePatientDetails, async (req, res) => {
  let response = {
    data: {
      patientId: req.body.patientId,
    },
    errorDetails: [],
  };

  if (req.body["patientDetails"]) {
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

  if (req.body.newPaymentDetails) {
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

  if (req.body.oldPaymentDetails) {
    for (const oldPaymentDetail of req.body.oldPaymentDetails) {
      let oldPaymentResponse = {};
      if (oldPaymentDetail.dueAmount === 0) {
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
});

/**
 * Get patient list based on request filter
 * Can be used for single patient details as well
 */
app.post(ENDPOINT_CONFIG.getPatients, async (req, res) => {
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
});

/**
 * Get list of patients with pending payments
 */
app.post(ENDPOINT_CONFIG.pendingPatients, async (req, res) => {
  let response = { errorDetails: [] };
  // Get all payments with due amount
  let pendingPatients = await crudUtil.findAll(
    { ...req.body.filter, dueAmount: { $gt: 0 } },
    req.body.projection,
    req.body.queryOptions,
    PaymentDetailModel
  );
  if (pendingPatients.errorDetails !== null) {
    response.errorDetails.push(pendingPatients.errorDetails);
    res.status(420);
  } else if (req.body.pageType === "PENDING") {
    // Get patient Details
    const patientIds = Array.from(
      new Set(pendingPatients.data.map((x) => x.patientId))
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
  response["pendingPatients"] = pendingPatients.data;
  res.send(response);
});

/**
 * Get list of patients with pending follow ups
 */
app.post(ENDPOINT_CONFIG.followUpPatients, async (req, res) => {
  let response = { errorDetails: [] };
  // Get all medical records with follow up date greater than today's date
  let followUpPatients = await crudUtil.findAll(
    req.body.filter,
    req.body.projection,
    req.body.queryOptions,
    MedicalDetailModel
  );
  if (followUpPatients.errorDetails !== null) {
    response.errorDetails.push(followUpPatients.errorDetails);
    res.status(420);
  } else if (req.body.pageType === "FOLLOW-UP") {
    // Get patient Details
    const patientIds = Array.from(
      new Set(followUpPatients.data.map((x) => x.patientId))
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
  response["followUpPatients"] = followUpPatients.data;
  res.send(response);
});

/**
 * Add new disease category
 */
app.post(ENDPOINT_CONFIG.addCategory, async (req, res) => {
  const uniqueId = uuidv4();
  req.body["categoryId"] = uniqueId;
  let response = await crudUtil.create(req.body, CategoryModel);
  if (response.errorDetails !== null) {
    res.status(420);
  } else {
    response = req.body;
  }
  res.send(response);
});

/**
 * Get all category details
 */
app.post(ENDPOINT_CONFIG.getCategories, async (req, res) => {
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
});

app.listen(port, () => {
  console.log();
  console.log(`Backend Server running on http://127.0.0.1:${port}`);
});
