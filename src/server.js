const app = require('./app').app


const PORT = process.env.PORT || 5467;
// // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
