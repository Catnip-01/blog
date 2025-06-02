import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from '../components/header'; 

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

  useEffect(() => {
    if (!title) return;

    fetch(`https://blog-3-68mp.onrender.com/blogs/title/${encodeURIComponent(title)}`)
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
    {/* Container to take all remaining space below header */}
    <div className="flex-grow flex justify-center items-start">
      <div
        className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-lg p-10 text-gray-300 font-sans"
        style={{ minHeight: 'calc(100vh - 4rem)' }} // adjust 4rem if header height is different
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
        <div className="mt-12 pt-6 border-t border-gray-700 flex justify-between text-gray-400 text-lg font-semibold">
          <span>Published on: {new Date(blog.createdAt || "").toLocaleDateString()}</span>
          <span className="italic">Author: {blog.author}</span>
        </div>
      </div>
    </div>
  </div>
);
};

export default BlogDetail;
