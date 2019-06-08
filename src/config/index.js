import dotenv from 'dotenv'
dotenv.config();

var serviceAccount = require("../../firebase-service-account-key.json");

const config = {
    FIREBASE_SERVICE_ACCOUNT: serviceAccount,
    FIREBASE_URL: process.env.FIREBASE_URL,
}

export default config
