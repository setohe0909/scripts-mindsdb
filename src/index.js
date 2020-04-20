const admin = require('firebase-admin')
const fs = require('fs')
const AWS = require('aws-sdk')

require('dotenv').config()

const serviceAccount = {
  type: process.env.ENV_FIRESTORE_SERVICE_TYPE,
  project_id: process.env.ENV_FIRESTORE_SERVICE_PROJECT_ID,
  private_key_id: process.env.ENV_FIRESTORE_SERVICE_PRIVATE_KEY_ID,
  private_key: process.env.ENV_FIRESTORE_SERVICE_PRIVATE_KEY,
  client_email: process.env.ENV_FIRESTORE_SERVICE_CLIENT_EMAIL,
  client_id: process.env.ENV_FIRESTORE_SERVICE_CLIENT_ID,
  auth_uri: process.env.ENV_FIRESTORE_SERVICE_AUTH_URI,
  token_uri: process.env.ENV_FIRESTORE_SERVICE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ENV_FIRESTORE_SERVICE_AUTH_PROVIDER_CERT,
  client_x509_cert_url: process.env.ENV_FIRESTORE_SERVICE_CLIENT_URI,
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.ENV_FIRESTORE_DOMAIN_URL,
});

const firestore = admin.firestore()

const sendToS3 = () => {
  const ID = process.env.ENV_AWS_ACCESS_KEY_ID
  const SECRET = process.env.ENV_AWS_SECRET_ACCESS_KEY
  const BUCKET_NAME = process.env.ENV_AWS_S3_BUCKET_NAME

  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
  })

  // Read content from the file
  const fileName = process.env.ENV_LOCAL_FILE_NAME
  const fileContent = fs.readFileSync(fileName)

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('s3.upload', err)
      throw err
    }
    console.log(`File uploaded successfully. ${data.Location}`)
  })
}

const generateFile = (data) => {
  fs.writeFile(process.env.ENV_LOCAL_FILE_NAME, JSON.stringify(data), (err) => {
    if (err) {
      console.error('generateFile', err)
      throw err
    }

    console.log('File created successfully')
    sendToS3()
  })
}

const getAnswers = async () => {
  const answersCollection = firestore.collection('answers')
  const snapshot = await answersCollection.get()

  const data = {}
  snapshot.forEach(doc => {
    const docData = doc.data()
    docData.submittedDateFormatted = docData.submittedDate ? docData.submittedDate.toDate() : ''
    data[doc.id] = docData
  })

  console.log('data generated successfully')
  generateFile(data)
}

getAnswers()
