const express = require("express");
const getDbConnect = require("./configuration/DbConnet");
const getCloudinaryConnect = require("./configuration/CloudinarySetup");
const app = express();
var cors = require("cors");

// body ke andar se form data se file ko nikalne ke leaye
const fileUploader = require("express-fileupload");

//body ke andar form se data ko nikalne ke leaye
var bodyParser = require("body-parser");

// body ke andar form-data se data ko extract karne ke leaye nhi to undefined aaega uske leaye multer use keaye
var multer = require("multer");
var forms = multer();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/Auth");
const categotyRouter = require("./routes/Category");
const productRouter = require("./routes/Product");
const addressRouter = require("./routes/Address");
const profileRouter = require("./routes/Profile");
const paymentRouter = require("./routes/Payment");
require("dotenv").config();
// app.use(cors());

// middle wares to extract data
// app.use(bodyParser.json());
// app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

// middle ware for extracting the file from body ke andar form-data se
app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

getDbConnect();
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
console.log(process.env.PORT);

// cloudinary setup connection
getCloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// desire initial path
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categotyRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/payment", paymentRouter);
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "I am backend of Shopping24",
  });
});
