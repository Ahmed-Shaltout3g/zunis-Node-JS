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
    }),
};
