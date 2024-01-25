import joi from "joi";

export const createProductVaildation = {
  body: joi
    .object()
    .required()
    .keys({
      title: joi.string().required(),
      caption: joi.string().required(),
      price: joi.number().required(),
      size: joi.array().items(joi.string()).required(),
      weight: joi.array().items(joi.string()).required(),
      discount: joi.number().required(),
    }),
};

export const updateProductVaildation = {
  query: joi.object().required().keys({
    categoryId: joi.string().required(),
    productId: joi.string().required(),
  }),
};

export const getProductVaildation = {
  params: joi.object().required().keys({
    categoryId: joi.string().required(),
    productId: joi.string().required(),
  }),
};
