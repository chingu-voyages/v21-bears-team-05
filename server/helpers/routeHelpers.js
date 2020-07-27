const Joi = require("joi");

//  We do data validation with Joi

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      //  If schema doesnt validate body => return error
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string(),
      surname: Joi.string(),
    }),
    userUpdateSchema: Joi.object().keys({
      id: Joi.string(),
      method: Joi.array(),
      avatar: Joi.string(),
      name: Joi.string(),
      bio: Joi.string(),
      cupboard: Joi.array(),
      recipeList: Joi.array(),
      local: Joi.array(),
      facebook: Joi.array(),
      google: Joi.array(),
    }),
  },
};
