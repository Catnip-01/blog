import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  author: string;
  text: string;
  createdAt?: string;
}

interface BlogCardProps {
  title: string;
  description: string;
  initialLikes?: number;
  initialComments?: Comment[];
 // currentUsername: string; // to send as author for comments
}

export default function BlogCard({ title, description,  initialComments = [] }: BlogCardProps) {
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

    const handleLike = async () => {
    console.log("Like button clicked");
    if (loadingLike) return;
    setLoadingLike(true);
    try {
        const response = await axios.post(`https://blog-4-sb3k.onrender.com/blogs/${encodeURIComponent(title)}/like`);
        console.log("Like response:", response.data);
        setLikes(response.data.likes);
    } catch (error) {
        console.error("Error liking blog:", error);
    } finally {
        setLoadingLike(false);
    }
    };
  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

const handleCommentPost = async () => {
  if (commentInput.trim() === '') return;

  if (loadingComment) return;
  setLoadingComment(true);

  try {
    const response = await axios.post(`https://blog-4-sb3k.onrender.com/blogs/${encodeURIComponent(title)}/comment`, {
      // Remove author field here:
      text: commentInput.trim(),
    });

    setComments(response.data); // backend returns updated comments array
    setCommentInput('');
  } catch (error) {
    console.error("Error posting comment:", error);
  } finally {
    setLoadingComment(false);
  }
};

  return (
    <div className="border p-4 rounded-lg shadow-lg w-full bg-black text-white">
      <Link to={`/blog/title/${encodeURIComponent(title)}`} className="text-xl font-bold hover:underline block mb-2">
        {title}
      </Link>
      <p className="text-gray-300 mb-4">{description}</p>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={loadingLike}
          className={`flex items-center space-x-1 text-red-500 hover:text-red-600 ${loadingLike ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1 4.5 2.09C13.09 4 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likes}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleComments}
          className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.986 8.986 0 01-4.04-1.022L3 19l1.022-5.04A8.986 8.986 0 013 12c0-4.418 3.134-8 7-8s7 3.582 7 8z" />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 bg-gray-100 p-3 rounded-md">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full p-2 border rounded mb-2 bg-gray-400 text-black"
          />
          <button
            type="button"
            onClick={handleCommentPost}
            disabled={loadingComment}
            className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${loadingComment ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Post
          </button>
            <div>
            {comments.map((cmt, index) => (
            <div key={index} className="bg-gray-400 p-2 rounded shadow-sm border break-words text-black">
                <b>{cmt.author ?? "Anonymous"}:</b> {cmt.text}
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
