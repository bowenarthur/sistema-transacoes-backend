import express from 'express';
import cors from 'cors';
import index from './routes/index';
import accountRoutes from './routes/account-routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());
app.use(index);
app.use('/conta', accountRoutes);

export default app;