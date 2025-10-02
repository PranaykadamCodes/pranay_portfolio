'use client';

import { useEffect, useState } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";
import { useBlogStore } from "../stores/blogStore";

interface BlogProps {
  window: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Blog({ window, startDrag }: BlogProps) {
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();
  const { blogPosts, fetchBlogPosts } = useBlogStore();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Window Title Bar */}
      <div 
        className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-move border-b"
        onMouseDown={(e) => startDrag(e, window.id, "move")}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button 
              className="w-3 h-3 bg-red-500 rounded-full"
              onClick={() => closeWindow(window.id)}
            />
            <button 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              onClick={() => toggleMinimize(window.id)}
            />
            <button 
              className="w-3 h-3 bg-green-500 rounded-full"
              onClick={() => toggleMaximize(window.id)}
            />
          </div>
          <span className="text-gray-700 text-sm">Blog</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedPost ? (
          <div>
            <button 
              onClick={() => setSelectedPost(null)}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Posts
            </button>
            <article>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedPost.title}
              </h1>
              <div className="text-gray-600 mb-4">
                Published on {new Date(selectedPost.published_at).toLocaleDateString()}
              </div>
              <div className="prose max-w-none">
                <p>{selectedPost.description}</p>
                <a 
                  href={selectedPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Read full article on Dev.to →
                </a>
              </div>
            </article>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Posts</h2>
            
            {blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Blog Posts Found</h3>
                <p className="text-gray-500">Configure your Dev.to API key to display blog posts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPost(post)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{post.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
