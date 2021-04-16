import mongoose, { Document, Model } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

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

interface UserModel extends Model<UserDocument> {}
