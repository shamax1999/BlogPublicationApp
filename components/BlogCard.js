import React from 'react';
import './style.css';

const BlogCard = ({ post }) => {
  return (
    <div className="col-sm-12 col-md-4 col-lg-4 mb-4">
      <div className="card">
        {post.image_url ? (
          <img src={post.image_url} className="card-img-top" alt={post.title} />
        ) : (
          <div className="card-img-top placeholder"></div>
        )}
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.content.slice(0, 100)}...</p>
          <a href={`/post/${post.id}`} className="btn btn-primary">Read More</a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

