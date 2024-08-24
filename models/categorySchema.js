const { Schema, model } = require("mongoose");
const Joi = require("joi");

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "exam-admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Categories = model("exam-category", categorySchema);

const validateCategory = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    adminId: Joi.string(),
  });
  return schema.validate(body);
};
module.exports = {Categories, validateCategory}