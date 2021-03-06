import dotenv from 'dotenv'
dotenv.config();

var serviceAccount = {
    firebase_url: process.env.FIREBASE_URL,
    type: process.env.TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id : process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_X509_CERT_URL
}

const config = {
    FIREBASE_SERVICE_ACCOUNT: serviceAccount,
    FIREBASE_URL: serviceAccount.firebase_url
}

export default config
