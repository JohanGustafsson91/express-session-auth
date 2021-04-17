import mongoose, { Document, Model } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";
import { BadRequestError } from "errors";

const UserSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
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
  },
  { timestamps: true }
);

UserSchema.virtual("fullName").get(function (this: UserDocument) {
  return this.firstName + this.lastName;
});

UserSchema.pre<UserDocument>("save", function preSave() {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, 10);
  }
});

UserSchema.methods.comparePasswords = function comparePasswords(password) {
  return compareSync(password, this.password);
};

UserSchema.post(
  "save",
  (error: mongoose.CallbackError, doc: any, next: Function) => {
    const duplicateError = (error as unknown) as DuplicateError | null;

    if (duplicateError === null || duplicateError.code !== 11000) return next();

    const { keyPattern, keyValue } = duplicateError;
    const [type] = Object.keys(keyPattern);
    const [firstLetter, ...rest] = type;
    const parsedError = new BadRequestError("Save user", [
      {
        message: `${firstLetter.toUpperCase()}${rest.join("")} already exists`,
        type,
        path: [Object.keys(keyValue)[0]],
      },
    ]);

    return next(parsedError);
  }
);

export const UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  UserSchema
);

export interface User extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserDocument extends User, Document {
  fullName(): string;
  comparePasswords(
    this: Model<UserDocument>,
    password: User["password"]
  ): string;
}

interface DuplicateError {
  name: string;
  code?: number;
  keyPattern: Record<string, string>;
  keyValue: Record<string, string>;
}

interface UserModel extends Model<UserDocument> {}
