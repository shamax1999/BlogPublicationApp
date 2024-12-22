import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

const BlogPost = ({ posts }) => {
  const { id } = useParams();
  const history = useHistory();

  const currentPost = posts.find(post => post.id === parseInt(id));
  const currentIndex = posts.indexOf(currentPost);

  const nextPost = posts[currentIndex + 1] || posts[0];

  if (!currentPost) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container my-5">
      <div className="post">
        {currentPost.image_url ? (
          <img src={currentPost.image_url} className="img-fluid" alt={currentPost.title} />
        ) : (
          <div style={{ height: '300px', backgroundColor: '#f4f4f4' }}></div>
        )}
        <h1>{currentPost.title}</h1>
        <p>{currentPost.content}</p>
        <button
          className="btn btn-secondary"
          onClick={() => history.push(`/post/${nextPost.id}`)}
        >
          Next Post
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
