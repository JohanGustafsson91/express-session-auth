import Joi from "joi";

export const validation = {
  firstName: Joi.string().allow("").optional(),
  lastName: Joi.string().allow("").optional(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({ minDomainSegments: 2 }),
};
