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
app.use(cors({origin : true}));
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*")
    next();
});

// firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });

// user route
const userRoute = require("./routes/user.js");
app.use("/api/users", userRoute);

// cart route
const cartRoute = require("./routes/cart.js");
app.use("/api/cart", cartRoute);

exports.app = functions.https.onRequest(app)