"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = require("bcryptjs");
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        requred: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
}, { timestamps: true });
UserSchema.virtual("fullName").get(function () {
    return this.firstName + this.lastName;
});
UserSchema.pre("save", function preSave() {
    if (this.isModified("password")) {
        this.password = bcryptjs_1.hashSync(this.password, 10);
    }
});
UserSchema.methods.comparePasswords = function comparePasswords(password) {
    return bcryptjs_1.compareSync(password, this.password);
};
exports.UserModel = mongoose_1.default.model("User", UserSchema);
