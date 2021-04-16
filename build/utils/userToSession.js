"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToSession = void 0;
const userToSession = (user) => ({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
});
exports.userToSession = userToSession;
