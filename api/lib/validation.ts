const Joi = require("@hapi/joi");

// Allow validation of the fields
class Validation {
  // Validation of email and 
  // password with lowercase, uppercase, digit with min 6 and max 20
  public userRegisterValidation(data) {
    const pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#.*])/;
    const schema = {
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .regex(pattern)
        .required()
        .min(6)
        .max(20),
      fullname: Joi
        .string()
        .min(4)
        .required(),
    }
    return Joi.validate(data, schema);
  }
  // Validation of email and 
  // password with lowercase, uppercase, digit with min 6 and max 20
  public userLoginValidation(data) {
    const pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#.*])/;
    const schema = {
      email: Joi
          .string()
          .required()
          .email(),
      password: Joi
          .string()
          .regex(pattern)
          .required()
          .min(6)
          .max(20)
    }
    return Joi.validate(data, schema);
  }
  // Validation of token
  public userTokenValidation(data) {
    const schema = {
      token: Joi
        .string()
        .required()
    }
    return Joi.validate(data, schema);
  }
  // Validation of forgot password
  public userForgotPasswordValidation(data) {
    const schema = {
      email: Joi
        .string()
        .required()
        .email()
    }
    return Joi.validate(data, schema);
  }
  // Validation of password with lowercase, uppercase, digit with min 6 and max 20
  public userPasswordValidation(data) {
    const pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#.*])/;
    const schema = {
      password: Joi
        .string()
        .regex(pattern)
        .required()
        .min(8),
    }
    return Joi.validate(data, schema);
  }
}
export default Validation;
