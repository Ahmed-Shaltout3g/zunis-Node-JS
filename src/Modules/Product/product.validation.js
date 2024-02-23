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
          view: joi.string(),
          bedrooms: joi.number().positive(),
          bathrooms: joi.number().positive(),
          finishingType: joi
            .string()
            .valid("super lux", "lux", "without finished", "Garden", "other"),
          yearOfConstruction: joi.number().positive(),
          shahrAqary: joi
            .string()
            .valid("registered", "eligible", "not sure")
            .required(),
          floor: joi.number().positive(),
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
