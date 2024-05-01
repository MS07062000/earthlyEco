require('dotenv').config({path:'../.env'});

// Note this file is to be used for generating the serviceAccountKey.json in production
const fs = require('fs');

// Define the data to be written to the JSON file
const jsonData = {
  type: "service_account",
  project_id: process.env.VITE_APP_PROJECTID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};

// Convert the JSON data to a string
const jsonString = JSON.stringify(jsonData, null, 2);

// Write the JSON string to a file
fs.writeFileSync("serviceAccountKey.json", jsonString);

console.log("serviceAccountKey.json file generated successfully");
