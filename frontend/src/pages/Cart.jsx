import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        addItem,
        decreaseQuantity,
        removeItem,
        cartTotal,
    } = useCart();

    return (<section className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6"> <div className="mx-auto max-w-5xl"> <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1> <p className="mt-2 text-gray-500">
        Review your selected dishes before continuing. </p>


        {cartItems.length === 0 ? (
            <div className="mt-10 rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
                <ShoppingBag className="mx-auto text-gray-400" size={44} />

                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    Your cart is empty
                </h2>

                <p className="mt-2 text-gray-500">
                    Explore our menu and add your favourite dishes.
                </p>

                <Link
                    to="/menu"
                    className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
                >
                    Browse Menu
                </Link>
            </div>
        ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                    {cartItems.map((item) => {
                        const itemId = item._id || item.id;

                        return (
                            <div
                                key={itemId}
                                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                    className="h-24 w-full rounded-lg object-cover sm:w-28"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-500">
                                        {item.category}
                                    </p>

                                    <h2 className="mt-1 font-semibold text-gray-900">
                                        {item.name}
                                    </h2>

                                    <p className="mt-1 text-gray-600">
                                        ₹{item.price} each
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => decreaseQuantity(itemId)}
                                            aria-label={`Decrease ${item.name} quantity`}
                                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span className="min-w-5 text-center font-medium">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => addItem(item)}
                                            aria-label={`Increase ${item.name} quantity`}
                                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        ₹{item.price * item.quantity}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(itemId)}
                                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={15} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order Summary
                    </h2>

                    <div className="mt-5 flex justify-between text-sm text-gray-600">
                        <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        <span>₹{cartTotal}</span>
                    </div>

                    <div className="my-4 border-t border-gray-200" />

                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Taxes or additional charges, if applicable, are not included.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            // Order creation will be connected in the next step.
                            window.location.href = "/menu";
                        }}
                        className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700"
                    >
                        Continue Shopping
                    </button>
                </aside>
            </div>
        )}
    </div>
    </section>


    );
}

export default Cart;
