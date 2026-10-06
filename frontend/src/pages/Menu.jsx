import MenuCard from "../components/MenuCard";

const menuItems = [
    {
     id: 1,
     name: "Classic Burger",
     description: "Juicy grilled burger with fresh vegetables.",
     price: 249,
     category: "Burger",
     image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella and basil.",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Creamy Pasta",
    description: "Creamy pasta prepared with herbs and parmesan.",
    price: 279,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "French Fries",
    description: "Crispy golden fries served with special dip.",
    price: 149,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
  },
];
 
function Menu() {
    return (
        <section className="min-h-screen bg-gray-50 px-6 py-16">

            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                 Our Menu
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                 Something delicious for everyone
                </h1>

                <p className="mt-4 text-gray-600">
                Explore our carefully prepared dishes made with quality
                ingredients.
                </p>
            </div>

            {/* Menu Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
            ))}
        </div>

        </div>
        </section>
    );
}

export default Menu;