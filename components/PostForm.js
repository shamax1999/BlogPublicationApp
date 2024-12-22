"use client";

import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { supabase } from '../utils/supabase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/ckeditor/App.css';

// const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), { ssr: false });
// const ClassicEditor = dynamic(() => import('@ckeditor/ckeditor5-build-classic'), { ssr: false });

export default function PostForm({ onSubmit, editingPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '');
      setContent(editingPost.content || '');
      setImageUrl(editingPost.image_url || '');
    } else {
      setTitle('');
      setContent('');
      setImage(null);
      setImageUrl('');
    }
  }, [editingPost]);

  const handleImageUpload = async () => {
    if (!image) return null;

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, image);

      if (error) {
        console.error("Image upload error:", error.message);
        return null;
      }

      const { data: publicData, error: urlError } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("Public URL error:", urlError.message);
        return null;
      }

      return publicData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during image upload:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImageUrl = await handleImageUpload();

    if (!uploadedImageUrl) {
      console.error("Image upload failed. Please try again.");
      return;
    }

    if (onSubmit) {
      await onSubmit({ title, content, image_url: uploadedImageUrl });
    } else {
      console.error("onSubmit function is not defined.");
    }
  };






  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
          required
        />
      </div>


      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content</label>
        <div className="border rounded">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', minWidth: '200px', height: '150px' }}
          />
          {/* <CKEditor
            editor={ClassicEditor}
            config={{
              licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzYwMzUxOTksImp0aSI6IjEzYmUxOTgzLTg5ZTktNDAzMC1iNjg3LWM5YTU5MmY1ZDBjOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjJhYjE3OTIxIn0.yVD1f2KvO4zRkkOkMdruU0MQw19Ryh5xNKmLUZsOhyAWyHr35nebONdW97gi3-TZxPcxvF5foQqMQaHXSciEoQ',
              toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter'],
              initialData: '<p>Hello from CKEditor 5 in React!</p>'
            }}
            onChange={handleEditorChange}
          /> */}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="imageUpload" className="form-label">Upload Image</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {editingPost ? 'Update Post' : 'Add Post'}
      </button>
    </form>
  );
}
