require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

function getDbConnect() {
  mongoose
    .connect(process.env.DATABASE_URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    })
    .then(() => console.log("Database connection done"))
    .catch((error) => {
      console.log("Error occured which connecting with db");
      console.log(error.message);
      process.exit(1);
    });
}

module.exports=getDbConnect;