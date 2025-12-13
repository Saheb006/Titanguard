import cors from 'cors';
import express from 'express';
import cookkieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true,  
}))

// routes import 

import routes from "./routes/routes.js";

app.use("/api/v1", routes);


export default app;