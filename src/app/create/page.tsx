"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Table from "@/components/Table";

const AddMenu = () => {
  const [formData, setFormData] = useState({
    menuTitle: "",
    slug: "",
    order: "",
    parentId: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [parentMenus, setParentMenus] = useState<{ id: string; title: string }[]>([]);
  const [menus, setMenus] = useState([]);


  // Fetch parent menu options from API
  const fetchParentMenus = async () => {
    try {
      const response = await axios.get("/api/menu");
      setParentMenus(response.data?.navItems);
      setMenus(response.data?.menuData);
    } catch (error) {
      console.error("Error fetching parent menus:", error);
      toast.error("Failed to load parent menus.");
    }
  };

  useEffect(() => {
    fetchParentMenus();
  }, []);


  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "order" ? Number(value) || "" : value, // Ensure order is a number
    }));
  };

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.menuTitle || !formData.slug || !formData.order) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      console.log(formData);
      
       await axios.post("/api/menu", {
        menuTitle: formData.menuTitle,
        slug: formData.slug,
        parentId: formData.parentId || null,
        isActive: formData.isActive,
        order: Number(formData.order),
      });

      toast.success("Menu created successfully!");

      fetchParentMenus();

      setFormData({
        menuTitle: "",
        slug: "",
        order: "",
        parentId: "",
        isActive: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create menu.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Error creating menu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-semibold mb-6">Add Menu</h2>

      <form onSubmit={handleMenuSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Menu Title</label>
          <input
            type="text"
            name="menuTitle"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.menuTitle}
            onChange={handleMenuChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Menu Slug</label>
          <input
            type="text"
            name="slug"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.slug}
            onChange={handleMenuChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Menu (Optional)</label>
          <select
            name="parentId"
            value={formData.parentId}
            onChange={handleMenuChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">None</option>
            {parentMenus?.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.title}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Order (Optional)</label>
          <input
            type="text"
            name="order"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.order}
            onChange={handleMenuChange}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Menu"}
        </button>
      </form>

      <Table menus={menus} fetchMenus={fetchParentMenus}/>
      <Toaster />
    </div>
  );
};

export default AddMenu;
