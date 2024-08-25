import catchAsyncError from "../middlewares/catchAsyncErrors";
import Category from "../models/category.model";

// Create a new category
export const createCategoryController = catchAsyncError(async (req, res, next) => {
  const { label, value } = req.body;
  
  const category = await Category.create({ label, value });

  return res.status(201).json({
    success: true,
    data: category,
  });
});

// Get all categories
export const getCategoriesController = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find();

  return res.status(200).json({
    success: true,
    data: categories,
  });
});

// Update a category
export const updateCategoryController = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { label, value } = req.body;

  const category = await Category.findByIdAndUpdate(id, { label, value }, { new: true });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: category,
  });
});

// Delete a category
export const deleteCategoryController = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
