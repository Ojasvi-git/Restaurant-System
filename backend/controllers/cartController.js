const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Menu = require("../models/Menu");

// Get the customer's cart and populate menu details
const getCartData = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate(
        "items.menuItem",
        "name description category price image isAvailable"
    );

    if (!cart) {
        return {
            _id: null,
            items: [],
            totalItems: 0,
            subtotal: 0,
        };
    }

    const items = cart.items
        .filter((item) => item.menuItem)
        .map((item) => ({
            menuItem: item.menuItem,
            quantity: item.quantity,
            lineTotal: item.menuItem.price * item.quantity,
        }));

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (total, item) => total + item.lineTotal,
        0
    );

    return {
        _id: cart._id,
        items,
        totalItems,
        subtotal,
        updatedAt: cart.updatedAt,
    };
};

// GET /api/cart
const getCart = async (req, res) => {
    try {
        const cart = await getCartData(req.user._id);

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("Get cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch your cart.",
        });
    }
};

// POST /api/cart/items
const addCartItem = async (req, res) => {
    try {
        const { menuItemId, quantity = 1 } = req.body;

        if (!mongoose.isValidObjectId(menuItemId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid menu item ID.",
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive whole number.",
            });
        }

        const menuItem = await Menu.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found.",
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "This dish is currently unavailable.",
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ menuItem: menuItem._id, quantity }],
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.menuItem.toString() === menuItem._id.toString()
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    menuItem: menuItem._id,
                    quantity,
                });
            }

            await cart.save();
        }

        const updatedCart = await getCartData(req.user._id);

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully.",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Add cart item error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add item to cart.",
        });
    }
};

// PATCH /api/cart/items/:itemId
// Set the exact quantity for a menu item
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid menu item ID.",
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1.",
            });
        }

        const menuItem = await Menu.findById(itemId);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found.",
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "This dish is currently unavailable.",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
 
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        const cartItem = cart.items.find(
            (item) => item.menuItem.toString() === itemId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in your cart.",
            });
        }

        cartItem.quantity = quantity;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated.",
            cart: await getCartData(req.user._id),
        });
    } catch (error) {
        console.error("Update cart item error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update cart quantity.",
        });
    }
};

// DELETE /api/cart/items/:itemId
const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid menu item ID.",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        const itemExists = cart.items.some(
            (item) => item.menuItem.toString() === itemId
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Item not found in your cart.",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.menuItem.toString() !== itemId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from cart.",
            cart: await getCartData(req.user._id),
        });
    } catch (error) {
        console.error("Remove cart item error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to remove item from cart.",
        });
    }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            cart: await getCartData(req.user._id),
        });
    } catch (error) {
        console.error("Clear cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to clear your cart.",
        });
    }
};

module.exports = {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
};