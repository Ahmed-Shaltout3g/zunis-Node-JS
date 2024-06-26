import userModel from "../../../DB/Models/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { decryptText, encryptText } from "../../utils/encryptionFunction.js";
import { comparePassword, hashingPassword } from "../../utils/hashing.js";
import { decodeToken, generateToken } from "../../utils/tokenFunctions.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    cpassword,
    typeOfUser,
    role,
  } = req.body;
  if (password == cpassword) {
    const user = await userModel.findOne({ email });
    if (user) {
      next(new Error("Email Already Exist", { cause: 401 }));
    } else {
      // const newUser = await new userModel({

      // });
      const encryptPassword = encryptText(
        password,
        process.env.CRYPTO_SECRET_KEY
      );

      const token = generateToken({
        payload: {
          fullName,
          email,
          password: encryptPassword,
          phoneNumber,
          cpassword,
          typeOfUser,
          role,
        },
      });
      if (token) {
        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
        // ${req.protocol}://${req.headers.host}
        // const message = `<a href=${confirmationLink}>click here</a>`;
        const emailSent = await sendEmail({
          to: email,
          subject: "Confirmation email",
          message: emailTemplate({
            link: confirmationLink,
            linkData: "Click to Confirm",
            subject: "confirmation email ",
          }),
        });
        console.log(emailSent);
        if (emailSent) {
          // await newUser.save();
          return res
            .status(201)
            .json({ message: "Sign up success please confirm email" });
        } else {
          next(new Error("Send Email Fail please try again", { cause: 500 }));
        }
      } else {
        next(new Error("Token generastion fail", { cause: 400 }));
      }
    }
  } else {
    next(new Error("password must match repassword", { cause: 401 }));
  }
};

// _____________________confirmEmail________________________

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decode = decodeToken({
    payload: token,
    signature: process.env.TOKEN_KEY,
  });
  const checkConfirm = await userModel.findOne({
    email: decode.email,
    isConfirmed: true,
  });
  if (checkConfirm) {
    res.redirect(`${process.env.FRONTEND_URL}#/confirmation-success`);
  }
  if (decode) {
    const decryptPass = decryptText(
      decode?.password,
      process.env.CRYPTO_SECRET_KEY
    );
    decode.isConfirmed = true;
    decode.password = decryptPass;
    const confirmUser = new userModel({
      ...decode,
    });
    await confirmUser.save();
    res.redirect(`${process.env.FRONTEND_URL}#/confirmation-success`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}#/confirmation-failure`);
  }
};
// ______________________________login________________________________

export const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-valid email or password", { cause: 400 }));
  }
  if (role != user.role) {
    return next(new Error("User Not Found With This Role!", { cause: 400 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("In-valid email or password", { cause: 401 }));
  }
  const token = generateToken({
    payload: {
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
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
// _______________________________________________________--
// ______________________________Admin Add User___________________________
export const AdminAddUser = async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    cpassword,
    typeOfUser,
    role,
  } = req.body;
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
        role,
      });

      const user = await newUser.save();
      req.failedDocument = { model: userModel, _id: newUser._id };

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
