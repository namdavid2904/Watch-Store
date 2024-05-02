const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbconnect");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");
const brandRouter = require("./routes/brandRoute");
const enquiryRouter = require("./routes/enquiryRoute");
const uploadRouter = require("./routes/uploadRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandling } = require("./middlewares/errorHandling");
const morgan = require("morgan");
const cors = require("cors");

dbConnect();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", uploadRouter);

app.use(notFound);
app.use(errorHandling);
app.listen(PORT, () => {
    console.log(`Server is running at PORT  ${PORT}`);
});