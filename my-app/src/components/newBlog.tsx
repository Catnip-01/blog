import React, { useEffect, useState, type FormEvent } from 'react';
import Header from './header';

interface FormData {
  title: string;
  description: string;
  content: string;
  author: string;
  imageUrl?: string;
 // ✅ Added
}

const CreateBlogForm: React.FC = () => {
  const loggedInUser = localStorage.getItem("username") || "";

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    author: loggedInUser,
    imageUrl: '',

  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 // const [newBlog, setBlogs] = useState([]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, author: loggedInUser }));
  }, [loggedInUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('https://blog-3-68mp.onrender.com/newBlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // ✅ Corrected line
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }

      const result = await response.json();
      setMessage('Blog post created successfully!');
      setFormData({
        title: '',
        description: '',
        content: '',
        author: loggedInUser,
        imageUrl: '',
       
      });
      console.log('Success:', result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <Header />
      <div className="bg-neutral p-8 rounded-lg border border-white shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New Blog Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-white text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-white rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
                    <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-white text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-white text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-white">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer flex justify-center py-2 px-4 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>

          {message && (
            <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBlogForm;
