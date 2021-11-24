export const collectionNames = {
    clinic: 'Clinic',
    patient: 'Patient',
    category: 'Category',
    user: 'User',
    medicalDetail: 'MedicalDetail'
}

export const DATE_SCHEMA = {
    day: Number,
    month: Number,
    year: Number
}

export const defaultUserData = {
  userId: String,
  name: 'Akshit',
  dateOfBirth: '1996-03-01',
  address: {
    area: 'Naraina',
    pincode: '110028',
    city: 'New Delhi',
    state: 'Delhi',
  },
  gender: 'Male',
  phoneNumber: {
    primary: '198237489',
  },
  selectedClinicId: String,
};