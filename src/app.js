const express = require('express');
const connectDB = require('./dbModels/db.config');
const bodyparser = require('body-parser')
const { router, unAuthorizedRouter } = require("./controllers/routes")
const cors = require("cors");
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const { setUserInReqFromCookie } = require('./middleware/authorization');
dotenv.config();

const PORT = process.env.PORT || 5467;

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: ["https://erp-pwa.netlify.app", "http://localhost:3000", "https://main--erp-pwa.netlify.app", "http://192.168.29.198:3000","https://erp-pwa-pi.netlify.app"],
    credentials: true
}))
// Middleware to parse JSON
app.use(bodyparser.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.get('/', (req, res) => res.json('hello wolrd'));



// Customer routes
app.use("/api/v1", unAuthorizedRouter);
app.use("/api/v1",setUserInReqFromCookie, router);


module.exports = {
    app
}
