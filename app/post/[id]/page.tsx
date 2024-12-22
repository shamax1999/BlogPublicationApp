'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
}

export default function BlogPost({ params }: { params: { id: Promise<string> } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params.id;
        setCurrentId(parseInt(resolvedParams));
      } catch (err) {
        console.error('Error fetching params:', err);
        setCurrentId(null);
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (currentId === null) return;

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) {
          throw error;
        }

        setPosts(data);
        const currentPost = data.find(post => post.id === currentId);
        if (currentPost) {
          setPost(currentPost);
        }
      } catch (err: any) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [currentId]);

  if (!isClient) {
    return null;
  }

  if (!post) {
    return <div className="alert alert-info">Loading...</div>;
  }

  const currentIndex = posts.findIndex(p => p.id === post.id);
  const nextPost = posts[currentIndex + 1] || posts[0];

  return (
    <div className="container my-5">
      <div className="post">
        {post.image_url ? (
          <img src={post.image_url} className="img-fluid post-image" alt={post.title} />
        ) : (
          <div className="post-placeholder"></div>
        )}
        <h1 className="post-title">{post.title}</h1>
        <p className="post-content">{post.content}</p>
        <button
          className="btn btn-primary next-post-btn"
          onClick={() => router.push(`/post/${nextPost.id}`)}
        >
          Next Post
        </button>
      </div>
    </div>
  );
}
