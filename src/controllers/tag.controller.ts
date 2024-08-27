import catchAsyncError from "../middlewares/catchAsyncErrors";
import Tag from "../models/tag.model";

export const createTagController = catchAsyncError(async (req, res, next) => {
  const { label, value } = req.body;

  const tag = await Tag.create({ label, value });

  return res.status(201).json({
    success: true,
    data: tag,
  });
});

export const getTagsController = catchAsyncError(async (req, res, next) => {
  const tags = await Tag.find();

  return res.status(200).json({
    success: true,
    data: tags,
  });
});

export const updateTagController = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { label, value } = req.body;

  const tag = await Tag.findByIdAndUpdate(id, { label, value }, { new: true });

  if (!tag) {
    return res.status(404).json({
      success: false,
      message: "Tag not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: tag,
  });
});

export const deleteTagController = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const tag = await Tag.findByIdAndDelete(id);

  if (!tag) {
    return res.status(404).json({
      success: false,
      message: "Tag not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tag deleted successfully",
  });
});
