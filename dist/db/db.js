"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const connectionString = String(config_1.config.mongoUri) || "";
const connectDB = async () => {
    await mongoose_1.default.connect(`${connectionString}/Second-Brain`)
        .then((result) => {
        console.log(`Database connected successfully.`);
    }).catch((err) => {
        console.log(connectionString);
        console.log(`Error connecting to database `, err.message);
    });
};
exports.default = connectDB;
