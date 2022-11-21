"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cash_out_1 = __importDefault(require("../controllers/cash-out"));
const transactions_1 = __importDefault(require("../controllers/transactions"));
const index = express_1.default.Router();
index.post('/cashout', (req, res) => {
    (0, cash_out_1.default)(req, res);
});
index.get('/transactions', (req, res) => {
    (0, transactions_1.default)(req, res);
});
exports.default = index;
//# sourceMappingURL=index.js.map