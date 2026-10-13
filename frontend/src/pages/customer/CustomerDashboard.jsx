import { useNavigate, Navigate } from "react-router-dom";
import {
    ShoppingCart,
    UtensilsCrossed,
    Package,
    UserRound,
    ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function CustomerDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { cartCount, cartTotal } = useCart();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "customer") {
        return <Navigate to="/" replace />;
    }

    const dashboardCards = [
        {
            title: "My Cart",
            description: "View your selected dishes and manage quantities.",
            icon: ShoppingCart,
            action: "Open Cart",
            onClick: () => navigate("/cart"),
            value: `${cartCount} item${cartCount !== 1 ? "s" : ""}`,
            extra: `Total: ₹${cartTotal}`,
        },
        {
            title: "Menu",
            description: "Explore our delicious dishes and add your favourites.",
            icon: UtensilsCrossed,
            action: "Explore Menu",
            onClick: () => navigate("/menu"),
            value: "Explore dishes",
            extra: "",
        },
        {
            title: "My Orders",
            description: "View your orders and track their status.",
            icon: Package,
            action: "View Orders",
            onClick: () => navigate("/customer/orders"),
            value: "Order history",
            extra: "",
            comingSoon: true,
        },
        {
            title: "My Profile",
            description: "Manage your account information.",
            icon: UserRound,
            action: "View Profile",
            onClick: () => navigate("/customer/profile"),
            value: user?.email || "Account details",
            extra: "",
            comingSoon: true,
        },
    ];

    return (<div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl">
        {/* Welcome */} <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"> <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Customer Dashboard </p>


            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome{user?.name ? `, ${user.name}` : " Back"}!
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
                Manage your cart, explore our menu and keep track of your
                restaurant experience from one place.
            </p>

            <button
                type="button"
                onClick={() => navigate("/menu")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
                Explore Menu
                <ArrowRight size={17} />
            </button>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-3">
                        <ShoppingCart className="text-gray-800" size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Cart Items</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {cartCount}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-3">
                        <UtensilsCrossed className="text-gray-800" size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Cart Total</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            ₹{cartTotal}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Dashboard cards */}
        <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
                Your Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-500">
                Choose what you would like to do.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                <Icon size={23} className="text-gray-800" />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-gray-900">
                                {card.title}
                            </h3>

                            <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                                {card.description}
                            </p>

                            <p className="mt-4 text-sm font-medium text-gray-800">
                                {card.value}
                            </p>

                            {card.extra && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {card.extra}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={card.onClick}
                                disabled={card.comingSoon}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {card.comingSoon ? "Coming Soon" : card.action}
                                {!card.comingSoon && <ArrowRight size={16} />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
    </div>


    );
}

export default CustomerDashboard;
