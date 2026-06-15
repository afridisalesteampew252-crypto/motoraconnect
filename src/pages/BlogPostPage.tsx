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
    if (post) {
      document.title = `${post.title} - JDM Global`;
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container-narrow py-20">
          <div className="space-y-4">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-surface-200 rounded animate-pulse w-1/4" />
            <div className="h-64 bg-surface-200 rounded animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <article className="container-narrow py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-surface-400">
              <Calendar className="w-3 h-3" />
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-4 text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-surface-500 leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {post.image_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-surface-100 p-8 sm:p-12">
          <div className="prose prose-surface max-w-none">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-bold text-surface-900 mt-8 mb-4">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold text-surface-900 mt-8 mb-3">{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-surface-900 mt-6 mb-2">{line.slice(4)}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="text-surface-600 ml-4">{line.slice(2)}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="text-surface-600 leading-relaxed mb-4">{line}</p>;
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
