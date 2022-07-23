import joi from "joi";

const postCategorySchema = joi.object({
  name: joi.string().required(),
});

export default postCategorySchema;