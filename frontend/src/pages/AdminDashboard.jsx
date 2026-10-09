
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  IndianRupee,
  Users,
  ClipboardList,
  ChefHat,
  UserRound,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Admin authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only admin can access this page
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const stats = [
    {
      title: "Total Menu Items",
      value: "—",
      description: "Menu API not connected",
      icon: Utensils,
    },
    {
      title: "Total Orders",
      value: "—",
      description: "Order API not connected",
      icon: ShoppingBag,
    },
    {
      title: "Total Sales",
      value: "—",
      description: "Sales API not connected",
      icon: IndianRupee,
    },
    {
      title: "Total Customers",
      value: "—",
      description: "Customer data not connected",
      icon: Users,
    },
  ];

  const sections = [
    {
      title: "Menu Management",
      description:
        "Manage restaurant dishes, prices, images and availability.",
      icon: Utensils,
      status: "Next step",
    },
    {
      title: "Order Management",
      description:
        "View customer orders and monitor their current status.",
      icon: ClipboardList,
      status: "Next step",
    },
    {
      title: "Chef & Staff",
      description:
        "Manage restaurant staff accounts and their roles.",
      icon: ChefHat,
      status: "Coming soon",
    },
    {
      title: "Customer Feedback",
      description:
        "Review customer ratings and restaurant feedback.",
      icon: Users,
      status: "Coming soon",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
              <LayoutDashboard size={17} />
              Admin Panel
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Welcome back, {user?.name || "Admin"}! Manage your
              restaurant from one place.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {user?.name || "Restaurant Admin"}
              </p>
              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Restaurant Summary
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Live statistics will appear after connecting the backend.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                      <Icon size={22} />
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-gray-400"
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management Sections */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Restaurant Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage the main operations of your restaurant.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                      <Icon size={24} />
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {section.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

       
      </div>
    </main>
  );
}

export default AdminDashboard;

