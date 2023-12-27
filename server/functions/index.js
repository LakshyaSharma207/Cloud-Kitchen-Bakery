const admin = require("firebase-admin");
const functions = require("firebase-functions");
require('dotenv').config()

const serviceAccountKey = require("./serviceAccountKey.json")

const express = require('express')
const app = express();

// Body PArser for our JSON data
app.use(express.json());

// cross origin issue
const cors = require('cors');
app.use(cors());

// firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });

// user route
const userRoute = require("./routes/user.js");
app.use("/api/users", userRoute);

exports.app = functions.https.onRequest(app)