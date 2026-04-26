"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const scheduler_1 = require("./utils/scheduler");
dotenv_1.default.config();
console.log("🚀 ChakraNet S&P 500 Alert Bot starting...");
(0, scheduler_1.scheduleJobs)();
