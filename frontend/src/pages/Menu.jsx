import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import MenuCard from "../components/MenuCard";
import api from "../services/api";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError("");


            const response = await api.get("/menu");
            const items = response.data.menuItems || [];

            // Public menu mein sirf available dishes show hongi.
            setMenuItems(items.filter((item) => item.isAvailable !== false));
        } catch (err) {
            const message =
                err.response?.data?.message || "Unable to load menu. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }


    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (<section className="min-h-screen bg-gray-50 px-6 py-16"> <div className="mx-auto max-w-7xl">
        {/* Heading */} <div className="mx-auto max-w-2xl text-center"> <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Our Menu </p>


            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Something delicious for everyone
            </h1>

            <p className="mt-4 text-gray-600">
                Explore our carefully prepared dishes made with quality
                ingredients.
            </p>
        </div>

        {/* Loading */}
        {loading && (
            <div className="mt-16 flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                <p className="text-sm text-gray-500">Loading menu items...</p>
            </div>
        )}

        {/* Error */}
        {!loading && error && (
            <div className="mx-auto mt-12 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="font-medium text-gray-800">
                    We couldn't load the menu.
                </p>
                <p className="mt-2 text-sm text-gray-500">{error}</p>

                <button
                    onClick={fetchMenuItems}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && menuItems.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems.map((item) => (
                    <MenuCard key={item._id} item={item} />
                ))}
            </div>
        )}

        {/* Empty Menu */}
        {!loading && !error && menuItems.length === 0 && (
            <div className="mt-12 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    No dishes available right now
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Please check back later for our delicious menu.
                </p>
            </div>
        )}
    </div>
    </section>


    );
}

export default Menu;
