import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.route';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
