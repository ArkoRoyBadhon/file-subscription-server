import bcrypt from "bcrypt";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";
import { createAcessToken } from "../utils/jwtToken";


export const registerUserController = catchAsyncError(
  async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    console.log(req.body);

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({
        success: true,
        duplicate: true,
        message: "email already in used",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      role,
      email,
      password: hashedPassword,
    });

    const tokenPayload = {
      email: user.email,
      userId: user._id,
    };

    const accessToken = createAcessToken(tokenPayload, "7d");
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    return res.json({
      success: true,
      message: "Account created successfully",
      accessToken,
      data: userResponse,
    });
  }
);

export const signinController = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      success: false,
      message: "email is not registered",
      data: null,
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.json({
      success: false,
      message: "Invalid password",
      data: null,
    });
  }
  const tokenPayload = {
    email: user.email,
    userId: user._id,
  };

  const accessToken = createAcessToken(tokenPayload, "1h");

  const userWithoutPassword = user.toObject();
  const { password: _, ...userResponse } = userWithoutPassword;

  return res.json({
    success: true,
    message: "Signin success",
    data: userResponse,
    accessToken,
  });
});


