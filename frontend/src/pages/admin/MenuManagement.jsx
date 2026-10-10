import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Utensils,
  X,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  isAvailable: true,
};

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fileInputRef = useRef(null);
  const imageUrlRef = useRef("");

  const fetchMenuItems = async () => {
    setLoading(true);

    try {
      const response = await api.get("/menu");
      setMenuItems(response.data.menuItems || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Release temporary browser image previews
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const clearImagePreview = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = "";
    }

    setPreview("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    clearImagePreview();
    setEditingId(null);
    setIsFormOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    clearImagePreview();
    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    imageUrlRef.current = previewUrl;
    setPreview(previewUrl);
  };

  const handleEdit = (item) => {
    resetForm();

    setEditingId(item._id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      price: String(item.price ?? ""),
      isAvailable: item.isAvailable ?? true,
    });

    setPreview(item.image || "");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      form.price === ""
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!editingId && !image) {
      toast.error("Please select a dish image.");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("category", form.category.trim());
    formData.append("price", String(price));
    formData.append("isAvailable", String(form.isAvailable));

    if (image) {
      formData.append("image", image);
    }

    setSaving(true);

    try {
      if (editingId) {
        const response = await api.put(`/menu/${editingId}`, formData);

        setMenuItems((previous) =>
          previous.map((item) =>
            item._id === editingId ? response.data.menuItem : item
          )
        );

        toast.success("Menu item updated successfully.");
      } else {
        const response = await api.post("/menu", formData);

        setMenuItems((previous) => [
          response.data.menuItem,
          ...previous,
        ]);

        toast.success("Menu item added successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save menu item. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(item._id);

    try {
      await api.delete(`/menu/${item._id}`);

      setMenuItems((previous) =>
        previous.filter((menuItem) => menuItem._id !== item._id)
      );

      if (editingId === item._id) {
        resetForm();
      }

      toast.success("Menu item deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete menu item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Admin / Menu Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Menu Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add dishes, manage prices and update availability.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            <Plus size={18} />
            Add New Dish
          </button>
        </div>

        {/* Add / Edit form */}
        {isFormOpen && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Dish" : "Add New Dish"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the dish details below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Dish Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Paneer Tikka"
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category *
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Starters, Main Course"
                    maxLength={60}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div className="flex items-center gap-3 self-end rounded-xl border border-gray-200 p-4">
                  <input
                    id="isAvailable"
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 accent-gray-900"
                  />

                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dish is available
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the dish..."
                  rows={3}
                  maxLength={1000}
                  required
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dish Image {!editingId && "*"}
                </label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Dish preview"
                      className="h-36 w-36 rounded-xl border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                      <ImagePlus size={32} />
                    </div>
                  )}

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="block w-full max-w-sm text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG or WEBP. Maximum size: 5 MB.
                    </p>

                    {editingId && (
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty to keep the existing image.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      {editingId ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={18} />
                      )}
                      {editingId ? "Update Dish" : "Save Dish"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Menu list */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                All Menu Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {menuItems.length} dish
                {menuItems.length === 1 ? "" : "es"} in your menu
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMenuItems}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <Loader text="Loading menu items..." />
          ) : menuItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
              <Utensils className="mx-auto text-gray-400" size={40} />

              <h3 className="mt-4 font-semibold text-gray-900">
                No menu items yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first dish to get started.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
              >
                <Plus size={17} />
                Add First Dish
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full  text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-4 font-semibold">Dish</th>
                    <th className="px-3 py-4 font-semibold">Category</th>
                    <th className="px-3 py-4 font-semibold">Price</th>
                    <th className="px-3 py-4 font-semibold">Availability</th>
                    <th className="px-3 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                          />

                          <div className="max-w-xs">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-600">
                        {item.category}
                      </td>

                      <td className="px-3 py-4 text-sm font-semibold text-gray-900">
                        ₹{Number(item.price).toFixed(2)}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.isAvailable
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            disabled={Boolean(deletingId) || saving}
                            aria-label={`Edit ${item.name}`}
                            className="rounded-lg border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={Boolean(deletingId) || saving}
                            aria-label={`Delete ${item.name}`}
                            className="rounded-lg border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {deletingId === item._id ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MenuManagement;

