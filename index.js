// it is the main file from which we start the server 



const app = require("./app.js");
const connectDB = require("./db.js");

const PORT = 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(" Failed to connect to DB:", err);
});


