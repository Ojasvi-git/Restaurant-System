function MenuCard({item}) {

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
         <div className="overflow-hidden">
            <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
            />
         </div>

         <div className="p-5">
            <span className="text-sm text-gray-500">{item.category}</span>
            <h3 className="mt-1 text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>

            <div className="mt-5 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">₹{item.price}</span>

            <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700">
            Add
          </button>
        </div>
        </div>
        </div>
    );
}

export default MenuCard;