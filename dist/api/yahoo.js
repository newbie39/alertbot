"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPrices = fetchPrices;
const axios_1 = __importDefault(require("axios"));
async function fetchPrices(tickers) {
    const symbols = tickers.join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    const { data } = await axios_1.default.get(url);
    return data.quoteResponse.result;
}
