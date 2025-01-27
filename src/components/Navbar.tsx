"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";




const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (id: number) => setDropdown(dropdown === id ? null : id);
  interface NavItem {
    id: number;
    title: string;
    slug: string;
    parentId: number | null;
    isActive: boolean;
    children?: NavItem[];
  }

  const [menus, setMenus] = useState<NavItem[]>([]);




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
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button className="flex items-center hover:bg-gray-700 px-3 py-1 rounded-md text-lg">
                        {item.title} <FiChevronDown className="ml-2" />
                      </button>
                      <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg w-full">
                        {item.children
                          .filter((subItem) => subItem.isActive)
                          .map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={item.slug + subItem.slug}
                              className="block px-1 py-2 hover:bg-gray-200 max-w-full overflow-hidden"
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
          {menus
            .filter((item) => item.parentId === null && item.isActive)
            .map((item) => (
              <div key={item.id}>
                {item.children && item.children.length > 0 ? (
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
                            href={item.slug + subItem.slug}
                            className="block px-4 py-2 hover:bg-gray-600"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link onClick={()=>setIsOpen(false)} href={item.slug} className="block px-4 py-2 hover:bg-gray-700">
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
