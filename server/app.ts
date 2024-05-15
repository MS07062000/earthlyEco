import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authMiddleWare from "./middlewares/auth";
import { getCategories } from "./services/categoriesOperations";
import { db, storage } from "./firebase";
import { getDownloadURL } from "firebase-admin/storage";
dotenv.config();

const app: Express = express();
const port = 5000;
const cookieParser = require("cookie-parser");

app.disable("x-powered-by");

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const environment = process.env.VITE_APP_ENVIRONMENT;
    const allowedOrigins: string[] =
      environment === "development"
        ? ["http://localhost:5173", "http://127.0.0.1:5173"]
        : [
            "https://maniecommercestore.web.app",
            "https://maniecommercestore.firebaseapp.com",
          ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1/auth", require("./routes/auth").default);
app.use("/api/v1/categories", require("./routes/categories").default);
app.use("/api/v1/product", require("./routes/product").default);
app.use(
  "/api/v1/wishlist",
  authMiddleWare,
  require("./routes/wishlist").default
);
app.use("/api/v1/cart", authMiddleWare, require("./routes/cart").default);
app.use("/api/v1/address", authMiddleWare, require("./routes/address").default);
app.use("/api/v1/refund", require("./routes/refund").default);
app.use("/api/v1/order", require("./routes/order").default);

app.listen(port, () => {
  console.log("Server started on port: ", port);
});

getCategories();
//helmet and compressor
//declare all routes in index.ts file and import it
//route should be like api/v1/something for versioning so that if you wish to upgrade you can use v2,v3,etc.

//passport package for auth