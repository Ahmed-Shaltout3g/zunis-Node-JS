import joi from "joi";

export const createCategoryVaildation = {
  body: joi.object().required().keys({
    name: joi.string().required(),
  }),
};

export const updateCategoryVaildation = {
  query: joi.object().required().keys({
    categoryId: joi.string().required(),
  }),
};
