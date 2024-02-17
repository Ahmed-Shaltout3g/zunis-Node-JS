import joi from "joi";

export const createProductVaildation = {
  body: joi
    .object()
    .required()
    .keys({
      title: joi.string().required(),
      caption: joi.string().required(),
      price: joi.number().required(),
      section: joi.string().valid("rent", "sale").required(),
      location: joi.string().required(),
      youtubeURL: joi.string().optional(),
      descLocation: joi.string().required(),
      rentDeatils: joi.object({}).optional(),
      propertyDesc: joi
        .object({
          size: joi.number().positive().min(20).required(),
          view: joi.string().required(),
          bedrooms: joi.number().positive().required(),
          bathrooms: joi.number().positive().required(),
          finishingType: joi
            .string()
            .valid("super lux", "lux", "without finished", "Garden", "other")
            .required(),
          yearOfConstruction: joi.number().positive().required(),
          shahrAqary: joi
            .string()
            .valid("registered", "eligible", "not sure")
            .required(),
          floor: joi.number().positive().required(),
        })
        .required(),
      PaymentMethod: joi
        .string()
        .valid("cash", "installments", "both")
        .required(),
    }),
};

export const updateProductVaildation = {
  query: joi.object().required().keys({
    productId: joi.string().required(),
  }),
};

export const getProductVaildation = {
  params: joi.object().required().keys({
    productId: joi.string().required(),
  }),
};
