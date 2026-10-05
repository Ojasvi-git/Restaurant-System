import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";

function Home() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

          <div>
            <span className="mb-5 inline-block rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              Welcome to FoodHouse
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
              Good food,
              <br />
              made with{" "}
              <span className="text-gray-500">passion.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 md:text-lg">
              Enjoy delicious food, quality ingredients and a dining
              experience made for you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/burger.jpg"
              alt="Delicious food"
              className="h-80 w-full object-cover transition duration-500 hover:scale-105 md:h-125"
            />
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">

          <div className="flex gap-4">
            <Clock className="text-gray-700" size={24} />
            <div>
              <h3 className="font-semibold">Quick Service</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fresh food served without unnecessary waiting.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <ShieldCheck className="text-gray-700" size={24} />
            <div>
              <h3 className="font-semibold">Quality Ingredients</h3>
              <p className="mt-1 text-sm text-gray-500">
                Carefully selected ingredients for every dish.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Star className="text-gray-700" size={24} />
            <div>
              <h3 className="font-semibold">Great Experience</h3>
              <p className="mt-1 text-sm text-gray-500">
                A comfortable experience from order to table.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;