import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  const filtered = selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Import Guides & Blog
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl">
            Free educational content about buying and importing Japanese vehicles. From auction guides to country-specific duty breakdowns.
          </p>
        </div>
      </div>

      <div className="container-wide -mt-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-video bg-surface-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-surface-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-200 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-surface-500 text-lg">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article key={post.id} className="card-interactive overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-surface-200 to-surface-300 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
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
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-surface-500 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-brand-600 transition-all duration-200 hover:gap-3 group"
                  >
                    Read more
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="h-16" />
    </div>
  );
}
