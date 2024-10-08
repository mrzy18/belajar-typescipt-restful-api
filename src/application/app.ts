import express from 'express';
import { publicRouter } from '../route/public-api';
import { errorMiddleware } from '../middleware/error-middleware';
import { apiRouter } from '../route/api';

export const app = express();
app.use(express.json());
app.use('/v1', publicRouter);
app.use('/v1', apiRouter)
app.use('/v1', errorMiddleware);
