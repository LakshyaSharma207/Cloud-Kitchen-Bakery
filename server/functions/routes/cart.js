const router = require("express").Router()
const admin = require("firebase-admin")
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

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
                // const quantity = doc.data().quantity + 1;
                // const updatedItem = await db
                //     .collection("cartItems")
                //     .doc(`/${userId}`) 
                //     .collection("items")
                //     .doc(`/${productId}/`)
                //     .update(quantity);
                // return res.status(200).send({ success: true, data: updatedItem });
                res.status(200).json({ message: 'Item already exists in the cart.' });

            } else {
                const data = {
                    productId: productId,
                    product_name: req.body.product_name, 
                    product_type: req.body.product_type, 
                    product_price: req.body.product_price, 
                    imageURL: req.body.icon, 
                    quantity: 1,
                }
                const addItem = await db
                    .collection("cartItems")
                    .doc(`/${userId}`) 
                    .collection("items")
                    .doc(`/${productId}/`)
                    .set(data);
                return res.status(200).send({ success: true, data: addItem })
            }

    } catch(err) {
        return res.send({ success: false, error: err });
    }
})

module.exports = router;