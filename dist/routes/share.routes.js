"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const share_controllers_1 = require("../controllers/share.controllers");
const login_middlewares_1 = require("../middlewares/login.middlewares");
const router = (0, express_1.Router)();
router.post('/share', login_middlewares_1.isLoggedIn, share_controllers_1.shareLink);
router.get('/share/:shareLink', login_middlewares_1.isLoggedIn, share_controllers_1.getShareLink);
exports.default = router;
