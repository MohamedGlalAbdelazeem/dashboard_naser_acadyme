import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteBlog, getAllBlogs, getFilteredBlogs } from "../../utils/blogs";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const fetchAllBlogs = async () => {
    let res = await getAllBlogs(page);
    console.log(res);
    if (res?.isSuccess) {
      setBlogs(res?.data || []);
    }
  };
  useEffect(() => {
    fetchAllBlogs();
  }, [page]);
  const handleDeleteBlog = async (id) => {
    const res = await deleteBlog(id);
    if (res?.isSuccess) {
      setBlogs((prev) => ({
        ...prev,
        blogs: prev?.blogs?.filter((blog) => blog?.id !== id),
      }));
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    let res = await getFilteredBlogs(search);
    if (res?.isSuccess) {
      setBlogs((prev) => ({
        ...prev,
        blogs: res?.data?.items || [],
      }));
    } else {
      toast.error(res?.message || "Something went wrong!");
      setSearch("");
      fetchAllBlogs();
    }
  };
  return (
    <div className="px-6">
      <div className=" flex flex-wrap flex-col sm:flex-row items-center justify-between gap-8 w-auto mb-6">
        <form className="bg-white flex w-full sm:max-w-md p-1 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search By Blog Title here"
            className="rounded-full w-full outline-none bg-white border-none pl-4 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#FBE1EC] hover:bg-primary hover:text-white transition-all text-black text-sm rounded-full px-5 py-2.5"
            onClick={(e) => handleSearch(e)}
          >
            Search
          </button>
        </form>
        <Link
          to="/Blogs/add-blog"
          className="border border-pink-600 text-pink-600 text-sm px-4 py-3 flex items-center gap-2 rounded-xl w-full sm:w-auto"
        >
          <Icon icon="octicon:plus-circle-16" />
          Add a Blog
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 rounded-lg">
          <thead className="bg-white  whitespace-nowrap">
            <tr>
              <td className="size-10 bg-gray-50"></td>
              {["Blog Cover", "Blog Title", "Publisher", "Date", "Action"].map(
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
            {blogs?.blogs?.map((blog, index) => (
              <tr key={index}>
                <td className="size-10 bg-gray-100">{index + 1}</td>
                <td>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${blog?.imageURL}`}
                    alt=""
                    className="w-8 h-8 rounded-lg mx-auto"
                  />
                </td>
                <td className="p-4 text-sm">{blog?.title}</td>
                <td className="px-6 py-3">{blog?.authorFullName}</td>
                <td className="px-6 py-3">{blog?.createdOn?.split("T")[0]}</td>
                <td className="py-3 flex items-center gap-2 justify-center">
                  <button
                    onClick={() => handleDeleteBlog(blog?.id)}
                    className="bg-[#FFF8F8] text-[#E23F3F] px-2 justify-center py-1 rounded-md flex items-center gap-1"
                  >
                    <Icon icon="fluent:delete-12-regular" />
                    Delete
                  </button>
                  <Link
                    to={`/blogs/blog/${blog?.id}`}
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
        <Pagination page={page} setPage={setPage} info={blogs} />
      </div>
    </div>
  );
};

export default Blogs;
