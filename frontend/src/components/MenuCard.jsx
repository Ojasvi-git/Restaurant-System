import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function MenuCard({ item }) {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            localStorage.setItem("pendingCartItem", JSON.stringify(item));


            navigate("/login", {
                state: { from: "/cart" },
            });

            toast("Please login to add items to your cart.");
            return;
        }

        if (user?.role !== "customer") {
            toast.error("Only customers can add items to the cart.");
            return;
        }

        addItem(item);
        toast.success(`${item.name} added to cart!`);


    };

    return (<div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"> <div className="overflow-hidden">
        <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
                e.currentTarget.style.display = "none";
            }}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        /> </div>


        <div className="p-5">
            <span className="text-sm text-gray-500">{item.category}</span>

            <h3 className="mt-1 text-lg font-semibold text-gray-800">
                {item.name}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
                {item.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-gray-800">
                    ₹{item.price}
                </span>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    <ShoppingCart size={16} />
                    Add
                </button>
            </div>
        </div>
    </div>


    );
}

export default MenuCard;
