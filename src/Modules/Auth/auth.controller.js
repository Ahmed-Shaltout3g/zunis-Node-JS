import userModel from "../../../DB/Models/user.model.js";
import { comparePassword, hashingPassword } from "../../utils/hashing.js";
import { decodeToken, generateToken } from "../../utils/tokenFunctions.js";
import bcrypt from "bcrypt";

// ______________________________signUp___________________________
export const signUp = async (req, res, next) => {
  const { fullName, email, password, phoneNumber, cpassword, typeOfUser } =
    req.body;
  if (password == cpassword) {
    const user = await userModel.findOne({ email });
    if (user) {
      next(new Error("Email Already Exist", { cause: 401 }));
    } else {
      const newUser = await new userModel({
        fullName,
        email,
        password,
        phoneNumber,
        typeOfUser,
      });

      const user = await newUser.save();

      if (user) {
        return res
          .status(201)
          .json({ message: "Sign up success please try to login" });
      } else {
        next(new Error("fail", { cause: 400 }));
      }
    }
  } else {
    next(new Error("password must match Cpassword", { cause: 401 }));
  }
};

// ______________________________login________________________________

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-valid email or password", { cause: 400 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("In-valid email or password", { cause: 401 }));
  }
  const token = generateToken({
    payload: {
      _id: user._id,
      fullName: user.firstName,
      email: user.email,
      role: user.role,
    },
  });
  if (token) {
    return res.status(200).json({ message: "login success", token });
  }

  next(new Error("error please try again "));
};

// ________________________forgetPassword_______________________________--

export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  const emailExist = await userModel.findOne({ email });
  if (!emailExist) {
    return next(new Error("In-valid Email ", { cause: 401 }));
  } else {
    const token = generateToken({ payload: { _id: emailExist._id } });

    if (!token) {
      next(
        new Error("Token generastion fail plrase try again", { cause: 500 })
      );
    } else {
      const restPasswordURL = `${req.protocol}://${req.headers.host}/auth/resetpassword/${token}`;
      const message = `<a href=${restPasswordURL}>click here</a>`;
      const emailSent = await sendEmail({
        to: email,
        subject: "Reset your password",
        message,
      });
      if (emailSent) {
        return res.status(201).json({ message: "Please check your email" });
      } else {
        next(new Error(" Fail send email ! please try again", { cause: 500 }));
      }
    }
  }
};

// ________________________ResetPassword_______________________________--

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const newPasswordHash = hashingPassword(
    newPassword,
    parseInt(process.env.SALT_ROUNDS)
  );
  const decode = decodeToken({ payload: token });
  if (!decode?._id) {
    next(new Error("decode fail ,please try again", { cause: 500 }));
  } else {
    const user = await userModel.findOneAndUpdate(
      { _id: decode._id },
      { password: newPasswordHash }
    );

    if (!user) {
      next(
        new Error(" fail to reset your password ,please try again", {
          cause: 400,
        })
      );
    } else {
      res.status(200).json({ message: "Done , please try to login" });
    }
  }
};
