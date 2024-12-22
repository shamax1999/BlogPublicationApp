import { FaEdit, FaTrash } from 'react-icons/fa';

export default function PostTable({ posts, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => onEdit(post)}
                  className="btn btn-sm btn-primary me-2"
                >
                  <FaEdit style={{ fontSize: '20px' }} />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="btn btn-sm btn-danger"
                >
                  <FaTrash style={{ fontSize: '20px' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
