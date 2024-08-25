import { NextFunction, Request, Response } from "express";
import QueryBuilder from "../builder/QueryBuilder";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Product from "../models/product.model";
import sendResponse from "../utils/sendResponse";


export const getAllProductsController = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const baseQueryBuilder = new QueryBuilder(Product.find(), req.query)
          .search(["fileName", "description", "fileType"])
          .filter();
  
        const totalDocuments = await baseQueryBuilder.modelQuery.countDocuments();
  
        const queryBuilder = new QueryBuilder(Product.find(), req.query)
          .search(["fileName", "description", "fileType"])
          .filter()
          .sort()
          .paginate()
          .fields();
  
        const products = await queryBuilder.modelQuery
          .populate("category")
          .populate("tag");
  
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Products fetched successfully",
          data: products,
          total: totalDocuments,
        });
      } catch (error) {
        console.log("Error fetching products:", error);
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Error fetching products",
          data: null,
          error: error,
        });
      }
    }
  );

// Controller to create a new product
export const createProductController = catchAsyncError(
  async (req, res, next) => {
    try {
      const productData = req.body;

      const newProduct = await Product.create(productData);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error,
      });
    }
  }
);

// Controller to update a product
export const updateProductController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const updateData = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error,
      });
    }
  }
);

// Controller to delete a product
export const deleteProductController = catchAsyncError(
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error,
      });
    }
  }
);
