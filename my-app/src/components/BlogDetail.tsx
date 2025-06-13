import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
}

const BlogDetail = () => {
  const { title } = useParams<{ title: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!title) return;

    fetch(`https://blog-4-sb3k.onrender.com/blogs/title/${encodeURIComponent(title)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setBlog(null);
      });
  }, [title]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm || !title) return;

    try {
      const response = await fetch(
        `https://blog-4-sb3k.onrender.com/blogs/title/${encodeURIComponent(title)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete blog");

      alert("Blog deleted successfully.");
      navigate("/"); // Redirect to home or another page
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the blog.");
    }
  };

  if (error)
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-600 text-xl font-semibold">Error: {error}</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-xl font-medium">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-black px-4 py-8">
      <Header />
      <div className="flex-grow flex justify-center items-start">
        <div
          className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-lg p-10 text-gray-300 font-sans"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-100">{blog.title}</h1>
          <p className="italic mb-8 border-l-4 border-gray-600 pl-4 text-gray-400">
            {blog.description}
          </p>
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full max-h-96 object-cover rounded-md mb-8 shadow-md"
            />
          )}
          <div className="text-lg leading-relaxed text-gray-300 space-y-6">
            {blog.content.split("\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-gray-700 flex justify-between items-center text-gray-400 text-lg font-semibold">
            <span>Published on: {new Date(blog.createdAt || "").toLocaleDateString()}</span>
            <span className="italic">Author: {blog.author}</span>
          </div>

          {/* Delete Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow-md transition duration-200 font-semibold"
            >
              Delete Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
