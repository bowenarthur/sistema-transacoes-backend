import express from 'express'
import cashout from '../controllers/cash-out';
import transactions from '../controllers/transactions';

const index = express.Router();
index.post('/cashout', (req, res) => {
  cashout(req, res);
});

index.get('/transactions', (req, res) => {
  transactions(req, res);
});
export default index;