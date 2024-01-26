import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_CLOUD)
    .then(() => {
      console.log(process.env.DB_CLOUD);
      console.log("connection DB success");
    })
    .catch(() => {
      console.log("connection DB faild");
    });
};
