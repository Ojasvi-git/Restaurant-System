import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const readSavedCart = () => {
    try {
        const savedCart = localStorage.getItem("restaurantCart");
        return savedCart ? JSON.parse(savedCart) : [];
    } catch {
        return [];
    }
};

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(readSavedCart);

    useEffect(() => {
        localStorage.setItem("restaurantCart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item) => {
        const itemId = item._id || item.id;


        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (cartItem) => (cartItem._id || cartItem.id) === itemId
            );

            if (existingItem) {
                return currentItems.map((cartItem) =>
                    (cartItem._id || cartItem.id) === itemId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            return [...currentItems, { ...item, quantity: 1 }];
        });


    };

    const decreaseQuantity = (itemId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    (item._id || item.id) === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (itemId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => (item._id || item.id) !== itemId
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                decreaseQuantity,
                removeItem,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}
