import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Table = ({ menus, fetchMenus  }) => {

    const handleUpdateAction = async (menuId, currentStatus) => {
        const toastId = toast.loading('Updating status...');
    
        try {
            await axios.put(`/api/menu/${menuId}`, {
                isActive: !currentStatus
            });
            fetchMenus();
    
            toast.success('Menu status updated successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to update menu status.', { id: toastId });
            console.error('Error updating menu status:', error);
        }
    };
    

    return (
        <div className="relative overflow-x-auto h-[312px] my-4 hide-scrollbar">
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white uppercase bg-[#2A5158] dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50 border-s-black">
                            NO
                        </th>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50 border-s-black">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50">
                            SLUG
                        </th>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50">
                            Parent ID
                        </th>

                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 border border-white border-opacity-50">
                            Actions
                        </th>

                    </tr>
                </thead>
                <tbody>

                    {
                        menus.map((menu, index) => (<tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-[#E7E7EA] even:dark:bg-gray-800 border-b dark:border-gray-700">

                            <td className="px-4 border border-black border-opacity-50">
                                {index + 1}
                            </td>
                            <td className="px-4 border border-black border-opacity-50">
                                {menu.id}
                            </td>
                            <td className="px-4 border border-black border-opacity-50">
                                {menu.title}
                            </td>
                            <td className="px-4 border border-black border-opacity-50">
                                {menu.slug}
                            </td>
                            <td className="px-4 border border-black border-opacity-50">
                                {menu.parentId ? "Sub Menu" : "Menu"}
                            </td>

                            <td className="px-4 border border-black border-opacity-50">
                                {menu.isActive ? "Active" : "Inactive"}
                            </td>
                            <td className="px-4 border border-black border-opacity-50">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => handleUpdateAction(menu.id, menu.isActive)}
                                >
                                    {menu.isActive ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </td>


                        </tr>))
                    }


                </tbody>
            </table>
        </div>
    );
};

export default Table;