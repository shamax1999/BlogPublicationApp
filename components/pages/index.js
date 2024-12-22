import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Home({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.image_url && <img src={post.image_url} alt={post.title} style={{ maxWidth: '300px' }} />}
            <Link href={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.is_premium ? 'Premium' : 'Free'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const { data: posts } = await supabase.from('posts').select('id, title, image_url, is_premium');
  return { props: { posts } };
}
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Home({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.image_url && <img src={post.image_url} alt={post.title} style={{ maxWidth: '300px' }} />}
            <Link href={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.is_premium ? 'Premium' : 'Free'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const { data: posts } = await supabase.from('posts').select('id, title, image_url, is_premium');
  return { props: { posts } };
}
