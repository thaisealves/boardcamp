import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().pattern(/^([0-9]{10,11})$/),
  cpf: joi.string().pattern(/^([0-9]{11})$/),
  birthday: joi.date(),
});

export default customerSchema;
