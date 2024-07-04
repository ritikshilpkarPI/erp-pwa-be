const express = require('express');
const connectDB = require('./dbModels/db.config');
const bodyparser = require('body-parser')
const router = require("./controllers/routes")
const cors = require("cors")
// require(dotenv).config()

const PORT = process.env.PORT || 5467;

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: ["https://erp-pwa.netlify.app/", 'http://localhost:3000', 'http://192.168.1.19:3000']
}))
// Middleware to parse JSON
app.use(bodyparser.json());

app.use("*", (req, res, next) => {
    console.log({body: req.body});
    next()
})
// Customer routes
app.use("/api/v1", router)

// // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
