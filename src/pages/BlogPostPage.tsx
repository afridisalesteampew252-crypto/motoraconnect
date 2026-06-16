import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} - Motoraconnect`;
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950">
        <div className="container-narrow py-20">
          <div className="space-y-4">
            <div className="h-8 bg-surface-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-surface-800 rounded animate-pulse w-1/4" />
            <div className="h-64 bg-surface-800 rounded animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <article className="container-narrow py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors font-mono">
          <ArrowLeft className="w-4 h-4" />
          back_to_blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-surface-500 font-mono">
              <Calendar className="w-3 h-3" />
              {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 text-balance leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-surface-400 leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {post.image_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-surface-700">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 sm:p-12">
          <div className="max-w-none space-y-1">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold text-white mt-8 mb-3">{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-2">{line.slice(4)}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="text-surface-300 ml-5 list-disc">{line.slice(2)}</li>;
              if (line.trim() === '') return <div key={i} className="h-3" />;
              return <p key={i} className="text-surface-300 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
