"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;


    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, image);

      if (error) {
        console.error("Upload error:", error);
        alert("Error uploading image: " + error.message);
        return;
      }

      const { publicUrl } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      imageUrl = publicUrl;
    }


    const user = supabase.auth.user();
    if (!user) {
      alert("You must be signed in to create a post.");
      return;
    }


    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        is_premium: isPremium,
        user_id: user.id,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      alert(`Error: ${error.message}`);
    } else {
      alert("Post created successfully!");
      setTitle("");
      setContent("");
      setIsPremium(false);
      setImage(null);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="content">
              Post Content
            </label>
            <textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center space-x-4">
            <input
              id="isPremium"
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="text-gray-700">
              Premium Post
            </label>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}

