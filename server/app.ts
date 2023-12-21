import express, { Express } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { router as categoriesAndProducts } from "./categoriesAndProducts/route";
import { router as userOperations } from "./userOperations/route";
import { router as orderProcessingOperations } from "./orderProcessingOperations/route";
dotenv.config();

const app: Express = express();
const port = 5000;

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        const environment = process.env.VITE_APP_ENVIRONMENT;
        const allowedOrigins: string[] = environment === 'development' ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : ['https://maniecommercestore.web.app'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}



//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/',categoriesAndProducts);
app.use('/', userOperations);
app.use('/', orderProcessingOperations);

app.listen(port, () => {
    console.log("Server started on port: ", port);
});