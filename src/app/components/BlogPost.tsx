"use client";

import React from "react";
import "@/app/styles/BlogPost.css";

interface BlogPostProps {
  header: string;
  text: string;
  created_at: string;
}

export default function BlogPost({ header, text, created_at }: BlogPostProps) {
  return (
    <div className="blog-post">
      <h2 className="blog-header">{header}</h2>
      <p className="blog-date">{new Date(created_at).toLocaleDateString()}</p>
      <p className="blog-text">{text}</p>
    </div>
  );
}
