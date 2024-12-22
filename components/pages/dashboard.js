"use client";

import { useState, useEffect } from 'react';
import { supabase } from "../../utils/supabase";
import PostForm from '@/components/PostForm';
import PostTable from '@/components/PostTable';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showTable, setShowTable] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddOrUpdate = async (post) => {
    if (editingPost) {
      const { error } = await supabase.from('posts').update(post).eq('id', editingPost.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('posts').insert([post]);
      if (error) alert(error.message);
    }
    setEditingPost(null);
    setShowTable(true);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) alert(error.message);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowTable(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="btn btn-primary px-6 py-2"
          onClick={() => {
            setEditingPost(null);
            setShowTable(false);
          }}
        >
          Add Post
        </button>
        <button
          className="btn btn-primary px-6 py-2"
          onClick={() => setShowTable(true)}
        >
          View Posts
        </button>
      </div>
      {showTable ? (
        <PostTable posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <PostForm onSubmit={handleAddOrUpdate} editingPost={editingPost} />
      )}
    </div>
  );
}
