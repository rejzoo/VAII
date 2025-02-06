'use client'

import { useEffect, useState } from "react";
import BlogPost from "./components/BlogPost";

export default function Main() {
  const [blogs, setBlogs] = useState<{ header: string; text: string; created_at: string }[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs/getBlogs");
        const result = await response.json();

        if (response.ok && result.success) {
          setBlogs(result.data);
        } else {
          console.error("Error fetching blogs:", result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchBlogs();
  }, []);
  
    return (
      <div className="flex flex-col items-center justify-start h-full pt-[8%]">
        <h1 className="text-5xl font-bold text-purple-100 mb-6 drop-shadow-lg text-center">
          Sealclubber
        </h1>

        <div className="blog-container">
          {blogs.length === 0 ? <p className="text-gray-400">No blogs found.</p> : null}
          {blogs.map((blog, index) => (
            <BlogPost key={index} header={blog.header} text={blog.text} created_at={blog.created_at} />
          ))}
        </div>
      </div>
    );
  }
  