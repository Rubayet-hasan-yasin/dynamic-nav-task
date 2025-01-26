"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";


const navItems = [
  {
    id: 1,
    menu: "home",
    title: "Home",
    slug: "/",
    parentId: null,
    isActive: true,
  },
  {
    id: 2,
    menu: "products",
    title: "Products",
    slug: "#",
    parentId: null,
    isActive: true,
    children: [
      {
        id: 3,
        menu: "electronics",
        title: "Electronics",
        slug: "/products/electronics",
        parentId: 2,
        isActive: true,
      },
      {
        id: 4,
        menu: "clothing",
        title: "Clothing",
        slug: "/products/clothing",
        parentId: 2,
        isActive: true,
      },
      {
        id: 5,
        menu: "appliances",
        title: "Home Appliances",
        slug: "/products/home-appliances",
        parentId: 2,
        isActive: true,
      },
    ],
  },
  {
    id: 6,
    menu: "services",
    title: "Services",
    slug: "#",
    parentId: null,
    isActive: true,
    children: [
      {
        id: 7,
        menu: "consulting",
        title: "Consulting",
        slug: "/services/consulting",
        parentId: 6,
        isActive: true,
      },
      {
        id: 8,
        menu: "maintenance",
        title: "Maintenance",
        slug: "/services/maintenance",
        parentId: 6,
        isActive: true,
      },
      {
        id: 11,
        menu: "Create Menu",
        title: "Create Menu",
        slug: "/create",
        parentId: 6,
        isActive: true,
      },
    ],
  },
  {
    id: 9,
    menu: "about",
    title: "About Us",
    slug: "/about",
    parentId: null,
    isActive: true,
  },
  {
    id: 10,
    menu: "contact",
    title: "Contact",
    slug: "/contact",
    parentId: null,
    isActive: true,
  },
];


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (id: number) => setDropdown(dropdown === id ? null : id);
  const [menus, setMenus] = useState([]);




  // Fetch parent menu options from API
  const fetchParentMenus = async () => {
    try {
      const response = await axios.get("/api/menu");
      setMenus(response.data?.navItems);

      console.log(response);
      
    } catch (error) {
      console.error("Error fetching parent menus:", error);
      toast.error("Failed to load parent menus.");
    }
  };

  useEffect(() => {
    fetchParentMenus();
  }, []);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            MyWebsite
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {menus
              .filter((item) => item.parentId === null && item.isActive)
              .map((item) => (
                <div key={item.id} className="relative group">
                  {item.children?.length > 0 ? (
                    <>
                      <button className="flex items-center hover:bg-gray-700 px-3 py-1 rounded-md text-lg">
                        {item.title} <FiChevronDown className="ml-2" />
                      </button>
                      <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg">
                        {item.children
                          .filter((subItem) => subItem.isActive)
                          .map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={item.slug + subItem.slug}
                              className="block px-4 py-2 hover:bg-gray-200"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.slug}
                      className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          {navItems
            .filter((item) => item.parentId === null && item.isActive)
            .map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                    >
                      {item.title} <FiChevronDown />
                    </button>
                    {dropdown === item.id && (
                      <div className="pl-6 bg-gray-700">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.slug}
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.slug} className="block px-4 py-2 hover:bg-gray-700">
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
