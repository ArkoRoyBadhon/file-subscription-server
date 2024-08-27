import { NextFunction, Request, Response } from "express";
import QueryBuilder from "../builder/QueryBuilder";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Product from "../models/product.model";
import Purchase from "../models/purchasedPlan";
import sendResponse from "../utils/sendResponse";
import path from "path";
import fs from "fs";
import Plan from "../models/plan.model";
import Tag from "../models/tag.model";
import User from "../models/user.model";

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
        .populate("tags");

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

export const getSingleProductController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      // Find the product by ID and populate any necessary fields
      const product = await Product.findById(productId)
        .populate("category")
        .populate("tags");

      if (!product) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Product not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error fetching product",
        data: null,
        error: error,
      });
    }
  }
);

const getMimeType = (fileType: string) => {
  const mimeTypes: { [key: string]: string } = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    zip: "application/zip",
    html: "application/html",
  };

  return mimeTypes[fileType] || "application/octet-stream";
};

export const downloadProductController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing or invalid",
      });
    }

    const { _id: userId } = req.user;

    const UserMain = await User.findById(userId);

    if (!UserMain) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Fetch the product by ID
    const product = await Product.findById(productId).populate("tags");

    if (!product) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    // Fetch the purchase record for the product by the user
    const purchase = await Purchase.findOne({ userId });

    if (!purchase) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "No purchase record found for you",
        data: null,
      });
    }

    const subscribePlan = await Plan.findById(purchase.plan);

    if (!subscribePlan) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Subscription plan not found",
        data: null,
      });
    }

    const expirationDate = new Date(purchase.createdAt);

    expirationDate.setDate(expirationDate.getDate() + subscribePlan.expire!);


    if (new Date() > expirationDate) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Subscription has expired",
        data: null,
      });
    }

    product.downloadCount = (product.downloadCount || 0) + 1;
    await product.save();

    // @ts-ignore
    if (product.tags?.label === "Premium") {
      if (UserMain.downloadedItems! >= subscribePlan.limit) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Download limit exceeded",
          data: null,
        });
      }

      UserMain.downloadedItems! += 1;
      await UserMain.save();

      // purchase.limit -= 1;
      // await purchase.save();

      await Purchase.findByIdAndUpdate(purchase._id, {
        limit: purchase.limit -1
      })

      if(purchase.limit <= 0) {
        return sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Subscription Limit Finished",
          data: null,
        });
      }
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      product.fileUrl
    );

    // console.log("Attempting to download file at:", filePath);

    if (!fs.existsSync(filePath)) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "File not found",
        data: null,
      });
    }

    const fileExtension = `.${product.fileType}`;
    const fileNameWithExtension = `${product.fileName}${fileExtension}`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileNameWithExtension}"`
    );
    res.setHeader("Content-Type", getMimeType(product.fileType));

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
);
