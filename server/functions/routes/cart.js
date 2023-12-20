const router = require("express").Router()
const admin = require("firebase-admin")

router.get('/', (req, res) => {
    return res.send("inside cart router")
});

router.post("/addToCart/:userId", async(req, res) => {
    const userId = req.params.userId;
    const productId = req.body.productId;

    try {
        const doc = await db
            .collection("cartItems")
            .doc(`/${userId}`) 
            .collection("items")
            .doc(`/${productId}/`)
            .get();

            if(doc.data()) {
                
            }

    } catch(err) {
        return res.send({ success: false, error: err });
    }
})

module.exports = router;