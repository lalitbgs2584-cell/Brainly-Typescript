"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = __importDefault(require("./db/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Read port safely from env
const PORT = parseInt(process.env.PORT || "3000", 10);
// Start the server only after DB connects
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app_1.app.listen(PORT, () => {
            console.log(`✅ App is listening on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`❌ Error starting server: ${err.message}`);
        }
        else {
            console.error("❌ Unknown error starting server:", err);
        }
        process.exit(1); // Exit process if DB/server fails
    }
};
startServer();
