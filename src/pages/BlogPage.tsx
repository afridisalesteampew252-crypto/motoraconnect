import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight, Tag, Terminal } from 'lucide-react';

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
    async function fetchPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  const filtered = selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// import_guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Import Guides & Blog
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Free educational content about buying and importing Japanese vehicles.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-surface-900 font-semibold'
                  : 'bg-surface-800/50 text-surface-400 border border-surface-700 hover:border-surface-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-800/30 border border-surface-700 rounded-2xl overflow-hidden">
                <div className="aspect-video bg-surface-800 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-surface-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-800 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-12 text-center">
            <p className="text-surface-400 text-lg font-mono">no_posts_found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post) => (
              <article key={post.id} className="group bg-surface-800/30 border border-surface-700/50 rounded-2xl overflow-hidden hover:border-surface-600 transition-all duration-300">
                <div className="aspect-video bg-surface-800 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-600 text-sm font-mono">no_image</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-surface-500 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-base font-semibold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h2>
                  <p className="text-sm text-surface-400 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-200 group/link"
                  >
                    Read more
                    <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
