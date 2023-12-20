const router = require("express").Router()
const admin = require("firebase-admin")
let data = [];

router.get('/', (req, res) => {
    return res.send("inside user router")
});

router.get("/jwtVerification", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({message: "Token not found"})
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        if(!decodedToken) {
            return res.send(500).json({success: false, message: "Unauthorized access"});
        }
        return res.status(200).json({success: true, data: decodedToken})
    }
    catch(err) {
        return res.send({success: false, error: err})
    }
})

// list all users
const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    admin.auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          data.push(userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();  

  router.get('/all', async (req, res, next) => {
    try {
        return res.status(200).send({ success: true, data: data });
    } catch(err) {
        return res.send({ success: false, error: `Error in getting users, ${err}`});
    }
  })

module.exports = router;