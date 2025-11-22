import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
    }

    const userInfo = {
      _id: user._id,
      createdAt: new Date(),
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET);
    user.password = undefined;

    res.status(StatusCodes.OK).json({
      success: true,
      message: "You have Logged in",
      data: user,
      token,
    });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === 11000) {
        res.status(400).json({
          success: false,
          message: "user already exist",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid user validation",
          error: err,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Unknown error",
        error: err,
      });
    }
  }
}
export async function register(req, res) {
  console.log(req.body);

  res.status(StatusCodes.OK).json({ 
    message: "User registered successfully"
  });

  //try {
  //   const createdUser = await userModel.create(user);
  //   console.log(createdUser)
//
  //  const userInfo = {
  //    _id: createdUser._id,
  //    createdAt: new Date(),
  //  };
  //  const token = jwt.sign(userInfo, process.env.AUTH_SECRET);
  //  createdUser.password = undefined;
//
  //  res.status(StatusCodes.CREATED).json({
  //    success: true,
  //    message: "You have registered",
  //    data: createdUser,
  //    token,
  //  
  //  });
  //} catch (err) {
  //  if (err instanceof Error && "code" in err) {
  //    if (err.code === 11000) {
  //      res.status(400).json({
  //        success: false,
  //        message: "user already exist",
  //      });
  //    } else {
  //      res.status(400).json({
  //        success: false,
  //        message: "Invalid user validation",
  //        error: err,
  //      });
  //    }
  //  } else {
  //    res.status(400).json({
  //      success: false,
  //      message: "Unknown error",
  //      error: err,
  //    });
  //  }
  //}
//}//
//
  //  export async function checkUser(req, res) {
  //    const user = req.user;
  //    if (!user) {
  //      throw new Error("User not Found");
  //    }
//
  //    res.json({
  //      success: true,
  //      message: "User is authenticated",
  //      data: user,
  //    });
}
