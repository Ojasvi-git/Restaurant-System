const Menu = require("../models/Menu");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "restaurant-menu",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// Create menu item (Admin only)
const createMenuItem = async (req, res) => {
  let uploadedPublicId;

  try {
    const { name, description, category, price, isAvailable } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category and price are required.",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid, non-negative price.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a dish image.",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);
    uploadedPublicId = uploadedImage.public_id;

    const menuItem = await Menu.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: numericPrice,
      image: uploadedImage.secure_url,
      cloudinaryPublicId: uploadedImage.public_id,
      isAvailable: isAvailable === undefined
        ? true
        : isAvailable === true || isAvailable === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      menuItem,
    });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader
        .destroy(uploadedPublicId)
        .catch(() => {});
    }

    console.error("Create menu item error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create menu item.",
    });
  }
};

// Get all menu items (Public)
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu items error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch menu items.",
    });
  }
};

// Get one menu item (Public)
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    const isInvalidId = error.name === "CastError";

    return res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: isInvalidId
        ? "Invalid menu item ID."
        : "Failed to fetch menu item.",
    });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  let uploadedPublicId;

  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    const { name, description, category, price, isAvailable } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Dish name cannot be empty.",
        });
      }
      menuItem.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty.",
        });
      }
      menuItem.description = description.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty.",
        });
      }
      menuItem.category = category.trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (
        price === "" ||
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid, non-negative price.",
        });
      }

      menuItem.price = numericPrice;
    }

    if (isAvailable !== undefined) {
      if (isAvailable !== "true" && isAvailable !== "false" &&
          isAvailable !== true && isAvailable !== false) {
        return res.status(400).json({
          success: false,
          message: "Invalid availability value.",
        });
      }

      menuItem.isAvailable =
        isAvailable === true || isAvailable === "true";
    }

    // Replace image only if a new one was uploaded
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      uploadedPublicId = uploadedImage.public_id;

      const oldPublicId = menuItem.cloudinaryPublicId;

      menuItem.image = uploadedImage.secure_url;
      menuItem.cloudinaryPublicId = uploadedImage.public_id;

      await menuItem.save();
      uploadedPublicId = null;

      // Remove old image after the database update succeeds
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (imageError) {
          console.error("Old Cloudinary image cleanup failed:", imageError.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Menu item updated successfully.",
        menuItem,
      });
    }

    await menuItem.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      menuItem,
    });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader
        .destroy(uploadedPublicId)
        .catch(() => {});
    }

    console.error("Update menu item error:", error.message);

    return res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.name === "CastError"
        ? "Invalid menu item ID."
        : "Failed to update menu item.",
    });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    await menuItem.deleteOne();

    // Delete Cloudinary image after successful DB deletion
    if (menuItem.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(menuItem.cloudinaryPublicId);
      } catch (imageError) {
        console.error("Cloudinary image deletion failed:", imageError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully.",
    });
  } catch (error) {
    console.error("Delete menu item error:", error.message);

    return res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.name === "CastError"
        ? "Invalid menu item ID."
        : "Failed to delete menu item.",
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};

