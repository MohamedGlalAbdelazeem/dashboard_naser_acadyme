import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../utils/users";
import Pagination from "../../components/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchAllUsers = async () => {
      let res = await getAllUsers(page);
      setUsers(res?.data);
    };
    fetchAllUsers();
  }, [page]);
  const handleDeleteUser = async (id) => {
    const res = await deleteUser(id);
    if (res?.isSuccess) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };
  return (
    <div className="px-6">
      <div className=" flex flex-wrap flex-col sm:flex-row items-center justify-between gap-8 w-auto mb-6">
        <div className="bg-white flex w-full sm:max-w-md p-1 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search By user Title here"
            className="rounded-full w-full outline-none bg-white border-none pl-4 text-sm"
          />
          <button
            type="button"
            className="bg-[#FBE1EC] hover:bg-primary hover:text-white transition-all text-black text-sm rounded-full px-5 py-2.5"
          >
            Search
          </button>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Link
            to="/users/add-user"
            className="border border-pink-600 text-pink-600 text-sm px-4 py-3 flex items-center gap-2 rounded-xl w-full sm:w-auto"
          >
            <Icon icon="octicon:plus-circle-16" />
            Add a user
          </Link>
          <Icon icon="ion:filter" className="text-3xl text-secondary" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 rounded-lg">
          <thead className="bg-white  whitespace-nowrap">
            <tr>
              <td className="size-10 bg-gray-50"></td>
              {["Full name", "Email", "Phone Number", "Action"].map(
                (item, index) => (
                  <th
                    key={index}
                    className="text-center px-4 py-2 text-secondary"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="text-center whitespace-nowrap divide-y bg-white divide-gray-200">
            {users?.users?.map((user, index) => (
              <tr key={index}>
                <td className="size-10 bg-gray-100">{index + 1}</td>
                <td className="p-4 text-sm">
                  {user?.firstName + " " + user?.lastName}
                </td>
                <td className="p-4 text-sm">{user?.email}</td>
                <td className="px-6 py-3">{user?.phoneNumber}</td>
                <td className="py-3 flex items-center gap-2 justify-center">
                  <button
                    onClick={() => handleDeleteUser(user?.id)}
                    className="bg-[#FFF8F8] text-[#E23F3F] px-2 justify-center py-1 rounded-md flex items-center gap-1"
                  >
                    <Icon icon="fluent:delete-12-regular" />
                    Delete
                  </button>
                  <Link
                    to={`/users/${user?.id}`}
                    className="bg-[#FEF8FF] text-[#984D9F] px-2 justify-center py-1 rounded-md flex items-center gap-1"
                  >
                    <Icon icon="ph:eye" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage} info={users} />
      </div>
    </div>
  );
};

export default Users;