import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Plus, X, Terminal, Check } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Buying Guide' | 'Education' | 'Market Analysis' | 'Cost Guide' | 'News';
  image_url: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Buying Guide' | 'Education' | 'Market Analysis' | 'Cost Guide' | 'News';
  image_url: string;
  published: boolean;
}

const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '', slug: '', excerpt: '', content: '', category: 'Buying Guide', image_url: '', published: false,
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) { console.error('Error fetching posts:', error); }
    finally { setLoading(false); }
  };

  const generateSlug = (title: string): string =>
    title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, slug: e.target.value }); };

  const openNewPostModal = () => {
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Buying Guide', image_url: '', published: false });
    setIsEditing(false); setEditingId(null); setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setFormData({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, image_url: post.image_url, published: post.published });
    setIsEditing(true); setEditingId(post.id); setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); };

  const savePost = async () => {
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) return;
    try {
      if (isEditing && editingId) {
        const { error } = await supabase.from('blog_posts').update({ ...formData, updated_at: new Date().toISOString() }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([{ ...formData, published_at: formData.published ? new Date().toISOString() : null }]);
        if (error) throw error;
      }
      closeModal(); fetchPosts();
    } catch (error) { console.error('Error saving post:', error); }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirm(null); fetchPosts();
    } catch (error) { console.error('Error deleting post:', error); }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase.from('blog_posts').update({ published: !post.published, published_at: !post.published ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq('id', post.id);
      if (error) throw error;
      fetchPosts();
    } catch (error) { console.error('Error toggling publish status:', error); }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">// blog_posts</span>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Blog Posts</h1>
        <button onClick={openNewPostModal} className="btn-primary text-sm"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-surface-500 font-mono">loading_posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-surface-500 font-mono">no_posts_found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-mono text-surface-500">title</th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-surface-500">category</th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-surface-500">status</th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-surface-500">published_at</th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-surface-500">actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <React.Fragment key={post.id}>
                    <tr className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium">{post.title}</td>
                      <td className="px-6 py-4 text-sm text-surface-400">{post.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-mono ${
                          post.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-surface-800 text-surface-500'
                        }`}>{post.published ? 'published' : 'draft'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500 font-mono">{formatDate(post.published_at)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEditModal(post)} className="text-surface-400 hover:text-emerald-400 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => togglePublish(post)} className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                            post.published ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}>{post.published ? 'unpublish' : 'publish'}</button>
                          <button onClick={() => setDeleteConfirm(post.id)} className="text-surface-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        {deleteConfirm === post.id && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-sm text-red-400 mb-2">Are you sure? This cannot be undone.</p>
                            <div className="flex gap-2">
                              <button onClick={() => deletePost(post.id)} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono hover:bg-red-500/20 transition-colors">confirm_delete</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-surface-800 text-surface-400 rounded-lg text-xs font-mono hover:bg-surface-700 transition-colors">cancel</button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-surface-800 sticky top-0 bg-surface-900 z-10">
              <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={closeModal} className="text-surface-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label-field">Title *</label><input type="text" name="title" value={formData.title} onChange={handleTitleChange} placeholder="Post title" className="input-field" /></div>
              <div><label className="label-field">Slug *</label><input type="text" name="slug" value={formData.slug} onChange={handleSlugChange} placeholder="auto-generated-slug" className="input-field font-mono" /></div>
              <div><label className="label-field">Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="Brief summary" rows={2} className="input-field resize-none" /></div>
              <div><label className="label-field">Content *</label><textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Full post content" rows={10} className="input-field resize-none" /></div>
              <div><label className="label-field">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="input-field"><option value="Buying Guide">Buying Guide</option><option value="Education">Education</option><option value="Market Analysis">Market Analysis</option><option value="Cost Guide">Cost Guide</option><option value="News">News</option></select></div>
              <div><label className="label-field">Image URL</label><input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="input-field" /></div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-emerald-500 focus:ring-emerald-500/20" />
                <span className="text-sm text-surface-300">Publish this post</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-surface-800 sticky bottom-0 bg-surface-900">
              <button onClick={closeModal} className="btn-secondary text-sm">Cancel</button>
              <button onClick={savePost} className="btn-primary text-sm">{isEditing ? 'Update Post' : 'Create Post'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdminPage;
