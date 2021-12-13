export const COLLECTION_NAMES = {
    clinic: 'Clinic',
    patient: 'Patient',
    category: 'Category',
    user: 'User',
    medicalDetail: 'MedicalDetail',
    paymentDetail: 'PaymentDetail',
}

export const DATE_SCHEMA = {
    day: Number,
    month: Number,
    year: Number
}

export const ADDRESS_SCHEMA = {
  area: String,
  pincode: String,
  city: String,
  state: String,
};

export const defaultUserData = {
  name: 'Akshit Verma',
  dateOfBirth: '1996-03-01',
  address: {
    area: 'Naraina',
    pincode: '110028',
    city: 'New Delhi',
    state: 'Delhi',
  },
  gender: 'Male',
  phoneNumber:'198237489',
};

export const defaultClinicData = {
  name: "Verma Clinic",
  address: {
    area: "Naraina",
    pincode: "110028",
    city: "New Delhi",
    state: "Delhi",
  },
  doctorInCharge: 'Dr. Akshit Verma',
};