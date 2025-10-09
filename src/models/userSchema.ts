import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export interface UserDocument extends Document {
  username: string;
  password: string;
  email: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  checkPass(password2: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true},
    email: { type: String, required: true, trim: true, unique: true },
    refreshToken: { type: String, default: "" },
  
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next();
  }
});
userSchema.methods.checkPass = async function (password2:string):Promise<boolean> {
   
    const result = await bcrypt.compare(password2,this.password)
   
    return result
}

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
export default User;
