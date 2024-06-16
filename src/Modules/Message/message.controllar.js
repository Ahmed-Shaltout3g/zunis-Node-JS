import messageModel from "../../../DB/Models/massage.model.js";
import messageToAdminModel from "../../../DB/Models/massageToAdmin.model.js";
import userModel from "../../../DB/Models/user.model.js";

export const addMessageToUser = async (req, res, next) => {
  let { body, sentTo } = req.body;
  if (!body || !sentTo) {
    return next(new Error("Please Fill Full Form! ", { cause: 401 }));
  }
  const user = await userModel.findById(sentTo);
  if (!user) {
    return next(new Error("in_valid user", { cause: 401 }));
  }
  const messageObject = { body, sentTo };
  const createMassage = await messageModel.create(messageObject);

  if (!createMassage) {
    return next(new Error("faild please try ", { cause: 401 }));
  }
  res.status(200).json({ message: "Done" });
};

export const sendMessageToAdmin = async (req, res, next) => {
  const { fullName, email, phone, message } = req.body;
  if (!fullName || !email || !phone || !message) {
    return next(new Error("Please Fill Full Form! ", { cause: 401 }));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("email not correct! ", { cause: 401 }));
  }

  const messageObject = { fullName, email, phone, message, from: user._id };
  const createMessage = await messageToAdminModel.create(messageObject);
  if (!createMessage) {
    return next(new Error("faild please try ", { cause: 401 }));
  }
  res.status(200).json({ message: "Done" });
};

export const getAllMessagesToAdmin = async (req, res, next) => {
  const messages = await messageToAdminModel.find();
  res.status(200).json({
    success: true,
    messages,
  });
};

export const getAllMessagesToUser = async (req, res, next) => {
  const { id } = req.params;
  const messages = await messageModel.find({ sentTo: id });
  res.status(200).json({
    success: true,
    messages,
  });
};
