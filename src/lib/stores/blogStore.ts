import { create } from 'zustand';
import type { BlogPost } from '../types/blogType';

interface BlogState {
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  fetchBlogPosts: (maxRetries?: number, delay?: number) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogPosts: [],
  setBlogPosts: (posts) => set({ blogPosts: posts }),

  fetchBlogPosts: async (maxRetries = 3, delay = 1000) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await fetch('/api/blog-posts');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        set({ blogPosts: posts });
        return;
      } catch (error) {
        console.error(`Failed to fetch blog posts (attempt ${retries + 1}):`, error);
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    console.error(`Failed to fetch blog posts after ${maxRetries} attempts`);
  },
}));
