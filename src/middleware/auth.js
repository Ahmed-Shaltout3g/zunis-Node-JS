import userModel from "../../DB/Models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";

import { decodeToken } from "../utils/tokenFunctions.js";

const authFunction = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return next(
      new Error("In_valid token ,please enter token", { cause: 400 })
    );
  }
  if (!token.startsWith("Ahmed__")) {
    return next(new Error("Wrong Prefix", { cause: 401 }));
  }
  const separaedToken = token.split("Ahmed__")[1];
  //   console.log(separaedToken);
  const decode = decodeToken({ payload: separaedToken });
  //   console.log(decode);
  if (!decode?._id) {
    return next(new Error("fail decode", { cause: 500 }));
  }
  const user = await userModel.findById(decode._id);
  if (!user) {
    return next(new Error("fail to get user", { cause: 401 }));
  }
  //   console.log(user);
  req.user = user;
  next();
};

export const Auth = () => {
  return asyncHandler(authFunction);
};

export const authorization = (accessPoint) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!accessPoint.includes(role)) {
      return next(new Error("NO_Authorized", { cause: 403 }));
    }
    next();
  };
};
