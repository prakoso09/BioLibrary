import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.get("/products", async (req, res) => {
    const product = request.body; // user will send this data

    if(!product.name || !product.price || !product.image) {
        return req.statusCode(400).json({ succuess: false, message: "Please provide all fields"});
    }

    const newProduct = new Product(product)

    try {
        await newpProduct.save(); // save the product to the database
        res.status(201).json({ success: true, data: newProduct})
    }catch (error) {
       console.error("Errror in creating product: ", error.message);
       req.status(500).json({ success: false, message: "Server error"});

    }

});



app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");
});



/*
hbQmXij6eAdOTZrB
prakoso8909
hbQmXij6eAdOTZrB
mongodb+srv://prakoso8909:hbQmXij6eAdOTZrB@cluster0.kfqstns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongodb+srv://prakoso8909:<hbQmXij6eAdOTZrB>@cluster0.kfqstns.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0

25 April 2025
1. Create a new file named `product.model.js` in the `backend/models` directory and add the following code:

*/