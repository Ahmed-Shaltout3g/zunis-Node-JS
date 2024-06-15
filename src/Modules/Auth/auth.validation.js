import joi from "joi";

export const signUpVaildation = {
  body: joi
    .object()
    .required()
    .keys({
      fullName: joi.string().required().min(3).max(50),

      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi.string().required(),
      cpassword: joi.string().valid(joi.ref("password")).required(),
      typeOfUser: joi
        .string()
        .valid("owner of real estate", "marketing company", "other")
        .required(),
      role: joi.string().valid("Admin", "User").optional(),
      phoneNumber: joi
        .string()
        .regex(/^(?:\+?20|0)(?:1\d{9}|7\d{8}|8\d{8}|9\d{8})$/),
    }),
};

export const signInVaildation = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi.string().required(),
      role: joi.string().valid("Admin", "User").required(),
    }),
};
