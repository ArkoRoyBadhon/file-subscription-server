import bcrypt from "bcrypt";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";
import { ITokenUser } from "../types/jwtAuth";
import { createAcessToken, createRefreshToken } from "../utils/jwtToken";
import sendResponse from "../utils/sendResponse";
import jwt, { JwtPayload } from 'jsonwebtoken'
import sendMessage from "../utils/sendMessage";

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

    const tokenPayload: ITokenUser = {
      email: user.email,
      role: user.role,
      userId: user._id.toString(),
    };


    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    return res.json({
      success: true,
      message: "Account created successfully",

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
  const tokenPayload: ITokenUser = {
    email: user.email,
    role: user.role,
    userId: user._id.toString(),
  };

  const accessToken = createAcessToken(tokenPayload, "7d");
  const refreshToken = createRefreshToken(tokenPayload);

  const userWithoutPassword = user.toObject();
  const { password: _, ...userResponse } = userWithoutPassword;

  return res.json({
    success: true,
    message: "Signin success",
    data: userResponse,
    accessToken,
    refreshToken,
  });
});



export const genereteAccessToken = catchAsyncError(async (req, res) => {
  const getToken = req.header("Authorization");

  if (!getToken)
    return res.status(400).json({ msg: "Invalid Authentication." });

  const refreshToken = getToken.split(" ")[1];
  console.log({ refreshToken });

  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = (decoded as JwtPayload).user;
    const accessTOkenPayload = {
      email: user.email,
      authId: user.authId,
      role: user.role,
    };

    const isExistUser = await User.findById(user.authId);
    if (!isExistUser) {
      return sendResponse(res, {
        success: false,
        data: null,
        message: "User not found",
        statusCode: 404,
      });
    }

    const newAccessToken = createAcessToken(accessTOkenPayload, "1h");

    sendResponse(res, {
      success: true,
      message: "Successfully retrive access token",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.error("Error decoding or verifying refresh token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});




export const resetPassword = catchAsyncError(async (req: any, res, next) => {
  const { password, oldPassword, email } = req.body;

  const user = req.user;

  if (!password || !oldPassword || !email) {
    return res.json({
      message: "password, oldPassword and email => is required",
    });
  }

  const theUser = await User.findOne({ email });

  // check if there no user
  if (!theUser) {
    return res.json({ message: `no user find on ${email}` });
  }

  // check is the email is same or not
  if (theUser.email !== user.email) {
    return res
      .status(403)
      .json({ message: "Email didn't matched=> forbiden access" });
  }

  // varify old password
  const isOk = await bcrypt.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return res.json({ message: "password didn't matched", success: false });
  }

  // create new hash password
  const newPass = await bcrypt.hash(password, 15);

  // update the new
  const updatePassword = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// forgot-password controller
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "No user found with this email!" });
  }

  const tokenPayload = {
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "5m",
    }
  );
  console.log(
    `${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}`
  );

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Reset your password - Fresh Blogs",

    `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Fresh Blogs</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`
  );

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
  });
});

// Resetting new password
export const recoverPassword = catchAsyncError(async (req, res) => {
  const { password } = req.body;
  const token = req.header("Authorization");
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  );
  if (!decoded)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Authentication." });

  const user = await User.findOne({
    email: decoded.email,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  const tokenPayload = {
    email: user.email,
    _id: user._id,
    role: user.role,
  };

  const accessToken = createAcessToken(tokenPayload, "1h");

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been successfully reset",
    accessToken,
  });
});