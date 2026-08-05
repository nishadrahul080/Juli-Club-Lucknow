import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BlogPost, PublishStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  Folder,
  User,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  HelpCircle,
  BarChart2,
  Globe,
  Share2,
  Code,
  List,
  Quote,
  Type,
  AlignLeft,
  X,
  Save,
  Check,
  ChevronRight,
  Sparkle
} from 'lucide-react';

export const BlogModule: React.FC = () => {
  const { cmsData, updateBlogs } = useCMS();
  const blogs = cmsData.blogs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'faq' | 'linking'>('content');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Companion Guide', 'Lucknow Lifestyle', 'Escort Tips', 'Nightlife', 'VIP Escorts'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered blogs list
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const status = blog.status || (blog.published ? 'published' : 'draft');
      const matchesStatus = selectedStatus === 'All' || status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchQuery, selectedCategory, selectedStatus]);

  const handleCreateNew = () => {
    const newPost: Partial<BlogPost> = {
      id: `blog-${Date.now()}`,
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      author: 'Juli Club Editorial',
      date: new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString(),
      status: 'published',
      category: 'Companion Guide',
      tags: ['Lucknow', 'Escorts', 'Guide'],
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      excerpt: '',
      content: '<h2>Introduction to Companion Services in Lucknow</h2>\n<p>Lucknow is renowned for its cultural heritage and luxurious lifestyle. When seeking premier companionship...</p>\n\n<h3>Why Choose Independent Companions?</h3>\n<p>Safety, privacy, and zero advance payment are key benefits...</p>',
      published: true,
      readingTime: '4 min read',
      isFeatured: false,
      isSticky: false,
      focusKeyword: 'Call Girl Service Lucknow',
      secondaryKeywords: ['Gomti Nagar Escorts', 'Hazratganj Call Girls'],
      canonicalUrl: 'https://lucknow.juliclub.in/blog/call-girl-service-lucknow',
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      autoToc: true,
      faqs: [
        { question: 'Is advance payment required for booking?', answer: 'No advance payment is ever required. Payment is 100% cash on delivery.' }
      ]
    };

    setEditingBlog(newPost);
    setActiveTab('content');
    setIsEditorOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({ ...blog });
    setActiveTab('content');
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter(b => b.id !== id);
      updateBlogs(updated as any);
      showToast('Blog post deleted successfully');
    }
  };

  // Helper to calculate reading time
  const calculateReadingTime = (text: string) => {
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) return;

    const slug = editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const readingTime = calculateReadingTime(editingBlog.content || '');

    const updatedBlog: BlogPost = {
      id: editingBlog.id || `blog-${Date.now()}`,
      slug,
      title: editingBlog.title,
      metaTitle: editingBlog.metaTitle || editingBlog.title,
      metaDescription: editingBlog.metaDescription || editingBlog.excerpt || '',
      author: editingBlog.author || 'Juli Club Editorial',
      date: editingBlog.date || new Date().toISOString().split('T')[0],
      category: editingBlog.category || 'Companion Guide',
      image: editingBlog.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      excerpt: editingBlog.excerpt || '',
      content: editingBlog.content || '',
      published: editingBlog.status === 'published',
      status: (editingBlog.status as PublishStatus) || 'published',
      scheduledAt: editingBlog.scheduledAt,
      readingTime,
      isFeatured: editingBlog.isFeatured || false,
      isSticky: editingBlog.isSticky || false,
      focusKeyword: editingBlog.focusKeyword || '',
      secondaryKeywords: editingBlog.secondaryKeywords || [],
      canonicalUrl: editingBlog.canonicalUrl || `https://lucknow.juliclub.in/blog/${slug}`,
      robots: editingBlog.robots || 'index, follow',
      ogTitle: editingBlog.ogTitle || editingBlog.title,
      ogDescription: editingBlog.ogDescription || editingBlog.excerpt || '',
      ogImage: editingBlog.ogImage || editingBlog.image,
      twitterCard: editingBlog.twitterCard || 'summary_large_image',
      autoToc: editingBlog.autoToc !== false,
      faqs: editingBlog.faqs || []
    } as any;

    const exists = blogs.some(b => b.id === updatedBlog.id);
    let newBlogs: BlogPost[];
    if (exists) {
      newBlogs = blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b));
    } else {
      newBlogs = [updatedBlog, ...blogs];
    }

    updateBlogs(newBlogs as any);
    setIsEditorOpen(false);
    setEditingBlog(null);
    showToast('Blog post saved successfully!');
  };

  // Content formatting toolbar helpers
  const insertFormatting = (tag: string, closeTag: string = '') => {
    if (!editingBlog) return;
    const current = editingBlog.content || '';
    if (closeTag) {
      setEditingBlog({ ...editingBlog, content: current + `\n${tag}Sample Text${closeTag}\n` });
    } else {
      setEditingBlog({ ...editingBlog, content: current + `\n${tag}\n` });
    }
  };

  // Internal linking suggestions finder
  const internalLinkSuggestions = useMemo(() => {
    if (!editingBlog || !editingBlog.content) return [];
    const contentLower = editingBlog.content.toLowerCase();
    const suggestions: { keyword: string; url: string; target: string }[] = [];

    const keywordsMap = [
      { keyword: 'Gomti Nagar', url: '/gomti-nagar', target: 'Gomti Nagar Location Page' },
      { keyword: 'Hazratganj', url: '/hazratganj', target: 'Hazratganj Location Page' },
      { keyword: 'Alambagh', url: '/alambagh', target: 'Alambagh Location Page' },
      { keyword: 'Indira Nagar', url: '/indira-nagar', target: 'Indira Nagar Location Page' },
      { keyword: 'Independent', url: '#profiles', target: 'Independent Companions Directory' },
      { keyword: 'College Girls', url: '#profiles', target: 'College Girls Filter' },
      { keyword: 'VIP Celebrity', url: '#profiles', target: 'VIP Category' }
    ];

    keywordsMap.forEach(item => {
      if (contentLower.includes(item.keyword.toLowerCase())) {
        suggestions.push(item);
      }
    });

    return suggestions;
  }, [editingBlog?.content]);

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#c5a059] selection:text-black">
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn sticky top-4 z-50">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-white">Professional Blog CMS</h2>
              <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                Enterprise Content Suite
              </span>
            </div>
            <p className="text-xs text-white/60">
              Create, schedule, edit, and optimize articles with rich text controls, blog SEO schema, and internal linking.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#c5a059]/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search posts by title or slug..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full sm:w-40 bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="text-xs text-white/50 font-mono">
          Showing <strong className="text-white">{filteredBlogs.length}</strong> of{' '}
          <strong className="text-white">{blogs.length}</strong> articles
        </div>
      </div>

      {/* Posts Grid / Table */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-[#111] flex items-center justify-between">
          <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider">Articles & Blog Posts</h3>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-white/20 mx-auto" />
            <p className="text-xs text-white/50">No blog posts found matching current filters.</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl text-xs font-bold"
            >
              Write First Article
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredBlogs.map(blog => {
              const status = blog.status || (blog.published ? 'published' : 'draft');
              return (
                <div
                  key={blog.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                          {blog.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : status === 'scheduled'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/10 text-white/60 border border-white/10'
                          }`}
                        >
                          {status}
                        </span>
                        {blog.isFeatured && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold">
                            ★ Featured
                          </span>
                        )}
                        {blog.isSticky && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">
                            📌 Sticky
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-serif font-bold text-white truncate">{blog.title}</h4>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/50 font-mono pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#c5a059]" /> {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-white/40" /> {blog.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/40" /> {blog.readingTime || calculateReadingTime(blog.content)}
                        </span>
                        <span className="text-white/40 truncate">/blog/{blog.slug}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-3 py-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Post
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && editingBlog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-white/10 bg-[#111] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/30">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    {editingBlog.id ? 'Edit Blog Article' : 'Create New Article'}
                  </h3>
                  <span className="text-[11px] text-white/50">
                    Professional Blog CMS & Enterprise SEO Optimizer
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Nav Tabs inside Editor */}
            <div className="px-6 border-b border-white/10 bg-[#141414] flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
              <div className="flex items-center gap-2 py-2">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'content'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Rich Content Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'seo'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Article SEO & Schema</span>
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'faq'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Post FAQs ({editingBlog.faqs?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab('linking')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'linking'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Internal Linking ({internalLinkSuggestions.length})</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              {activeTab === 'content' && (
                <div className="flex items-center bg-[#101010] border border-white/10 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      editorMode === 'edit' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      editorMode === 'preview' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'content' && (
                <>
                  {editorMode === 'edit' ? (
                    <div className="space-y-6">
                      {/* Grid Title & Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-white mb-1">Article Title *</label>
                          <input
                            type="text"
                            value={editingBlog.title || ''}
                            onChange={e => {
                              const title = e.target.value;
                              const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              setEditingBlog({ ...editingBlog, title, slug });
                            }}
                            placeholder="e.g. Complete Guide to Premium Independent Companions in Lucknow"
                            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c5a059] outline-none font-serif"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white mb-1">URL Slug</label>
                          <input
                            type="text"
                            value={editingBlog.slug || ''}
                            onChange={e => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                            placeholder="e.g. complete-guide-lucknow-companions"
                            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#c5a059] focus:border-[#c5a059] outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white mb-1">Category</label>
                          <select
                            value={editingBlog.category || 'Companion Guide'}
                            onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })}
                            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                          >
                            <option value="Companion Guide">Companion Guide</option>
                            <option value="Lucknow Lifestyle">Lucknow Lifestyle</option>
                            <option value="Escort Tips">Escort Tips</option>
                            <option value="Nightlife">Nightlife</option>
                            <option value="VIP Escorts">VIP Escorts</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white mb-1">Author Name</label>
                          <input
                            type="text"
                            value={editingBlog.author || ''}
                            onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })}
                            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white mb-1">Publishing Status</label>
                          <select
                            value={editingBlog.status || 'published'}
                            onChange={e => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                            className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Featured Image Section */}
                      <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                        <label className="block text-xs font-bold text-white flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                            Featured Image URL & Direct Upload
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">WebP Optimized</span>
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <img
                            src={editingBlog.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'}
                            alt="Featured"
                            className="w-24 h-24 rounded-xl object-cover border border-white/15 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-2 w-full">
                            <input
                              type="text"
                              value={editingBlog.image || ''}
                              onChange={e => setEditingBlog({ ...editingBlog, image: e.target.value })}
                              placeholder="https://..."
                              className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                            />
                            <p className="text-[11px] text-white/50">
                              Direct image URLs supported. Select from Media Library or paste image link.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-xs font-bold text-white mb-1">Article Excerpt / Summary</label>
                        <textarea
                          rows={2}
                          value={editingBlog.excerpt || ''}
                          onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                          placeholder="Short summary for blog index card and meta description..."
                          className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                        />
                      </div>

                      {/* Rich Text Editor Formatting Bar & Content Field */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-white">Rich Article HTML / Markdown Body</label>
                          <span className="text-[11px] font-mono text-[#c5a059]">
                            {calculateReadingTime(editingBlog.content || '')}
                          </span>
                        </div>

                        {/* Formatting Controls Bar */}
                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#181818] border border-white/15 rounded-t-xl text-xs">
                          <button
                            type="button"
                            onClick={() => insertFormatting('<h2>', '</h2>')}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-bold"
                            title="Insert Heading H2"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<h3>', '</h3>')}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-bold"
                            title="Insert Heading H3"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<strong>', '</strong>')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-bold"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<em>', '</em>')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded italic"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>')}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded"
                            title="Unordered List"
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<blockquote className="p-4 border-l-4 border-[#c5a059] bg-[#1a1a1a]">', '</blockquote>')}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded"
                            title="Quote Box"
                          >
                            <Quote className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<pre className="p-4 bg-[#111] rounded text-emerald-400 font-mono"><code>', '</code></pre>')}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded"
                            title="Code Block"
                          >
                            <Code className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2" alt="Companion in Lucknow" className="w-full rounded-xl my-4" />')}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded"
                            title="Embed Image"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('<table className="w-full text-xs text-left border border-white/10 my-4">\n  <thead><tr className="bg-white/5"><th>Feature</th><th>Details</th></tr></thead>\n  <tbody><tr><td>Location</td><td>Gomti Nagar</td></tr></tbody>\n</table>')}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] font-bold"
                            title="Table"
                          >
                            + Table
                          </button>
                        </div>

                        <textarea
                          rows={12}
                          value={editingBlog.content || ''}
                          onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })}
                          placeholder="Write article content using HTML or Markdown..."
                          className="w-full bg-[#1a1a1a] border border-white/15 rounded-b-xl p-4 text-xs text-white font-mono focus:border-[#c5a059] outline-none leading-relaxed"
                        />
                      </div>

                      {/* Display Toggles */}
                      <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                          <input
                            type="checkbox"
                            checked={editingBlog.isFeatured || false}
                            onChange={e => setEditingBlog({ ...editingBlog, isFeatured: e.target.checked })}
                            className="rounded accent-[#c5a059]"
                          />
                          <span>Feature on Homepage</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                          <input
                            type="checkbox"
                            checked={editingBlog.isSticky || false}
                            onChange={e => setEditingBlog({ ...editingBlog, isSticky: e.target.checked })}
                            className="rounded accent-[#c5a059]"
                          />
                          <span>Pin to Top (Sticky)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                          <input
                            type="checkbox"
                            checked={editingBlog.autoToc !== false}
                            onChange={e => setEditingBlog({ ...editingBlog, autoToc: e.target.checked })}
                            className="rounded accent-[#c5a059]"
                          />
                          <span>Generate Auto Table of Contents (TOC)</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    /* LIVE PREVIEW */
                    <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 space-y-6">
                      <div className="border-b border-white/10 pb-4">
                        <span className="px-2.5 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                          {editingBlog.category}
                        </span>
                        <h1 className="text-2xl font-serif font-bold text-white mt-2">{editingBlog.title || 'Untitled Article'}</h1>
                        <div className="flex items-center gap-4 text-xs text-white/50 mt-2 font-mono">
                          <span>By {editingBlog.author}</span>
                          <span>•</span>
                          <span>{editingBlog.date}</span>
                          <span>•</span>
                          <span>{calculateReadingTime(editingBlog.content || '')}</span>
                        </div>
                      </div>

                      <img
                        src={editingBlog.image}
                        alt="Preview Header"
                        className="w-full h-64 object-cover rounded-xl border border-white/10"
                      />

                      <div
                        className="text-sm text-white/80 space-y-4 font-sans leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: editingBlog.content || '' }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* SEO TAB */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-1">
                    <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#c5a059]" />
                      Article Search Engine Optimization (Blog SEO)
                    </h4>
                    <p className="text-xs text-white/50">
                      Configure custom meta tags, OpenGraph previews, and Google Article JSON-LD schema.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">
                        Meta Title ({editingBlog.metaTitle?.length || 0} / 60 chars)
                      </label>
                      <input
                        type="text"
                        value={editingBlog.metaTitle || ''}
                        onChange={e => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={editingBlog.focusKeyword || ''}
                        onChange={e => setEditingBlog({ ...editingBlog, focusKeyword: e.target.value })}
                        placeholder="e.g. Call Girl Service Lucknow"
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-white mb-1">
                        Meta Description ({editingBlog.metaDescription?.length || 0} / 160 chars)
                      </label>
                      <textarea
                        rows={2}
                        value={editingBlog.metaDescription || ''}
                        onChange={e => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={editingBlog.canonicalUrl || ''}
                        onChange={e => setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#c5a059] focus:border-[#c5a059] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Robots Meta Directive</label>
                      <input
                        type="text"
                        value={editingBlog.robots || 'index, follow'}
                        onChange={e => setEditingBlog({ ...editingBlog, robots: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Schema Preview */}
                  <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-2">
                    <label className="block text-xs font-bold text-white flex items-center justify-between">
                      <span>Article JSON-LD Schema (Auto-Generated)</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Valid Article Schema</span>
                    </label>
                    <pre className="p-3 bg-[#111] rounded-lg text-[11px] text-[#c5a059] font-mono overflow-x-auto">
                      {JSON.stringify(
                        {
                          '@context': 'https://schema.org',
                          '@type': 'BlogPosting',
                          headline: editingBlog.title,
                          description: editingBlog.metaDescription,
                          author: { '@type': 'Person', name: editingBlog.author },
                          datePublished: editingBlog.date,
                          image: editingBlog.image,
                          publisher: { '@type': 'Organization', name: 'Juli Club Lucknow' }
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}

              {/* FAQs TAB */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Blog Post FAQ Accordions</h4>
                      <p className="text-[11px] text-white/50">Add Q&A pairs to generate FAQ rich snippets on Google.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const faqs = editingBlog.faqs || [];
                        setEditingBlog({
                          ...editingBlog,
                          faqs: [...faqs, { question: 'New Question?', answer: 'Answer details...' }]
                        });
                      }}
                      className="px-3 py-1.5 bg-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add FAQ Item
                    </button>
                  </div>

                  {(editingBlog.faqs || []).map((faq, idx) => (
                    <div key={idx} className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c5a059]">FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBlog.faqs?.filter((_, i) => i !== idx);
                            setEditingBlog({ ...editingBlog, faqs: updated });
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={e => {
                          const updated = [...(editingBlog.faqs || [])];
                          updated[idx].question = e.target.value;
                          setEditingBlog({ ...editingBlog, faqs: updated });
                        }}
                        placeholder="Question..."
                        className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => {
                          const updated = [...(editingBlog.faqs || [])];
                          updated[idx].answer = e.target.value;
                          setEditingBlog({ ...editingBlog, faqs: updated });
                        }}
                        placeholder="Answer..."
                        className="w-full bg-[#141414] border border-white/15 rounded-lg p-3 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* INTERNAL LINKING TAB */}
              {activeTab === 'linking' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#181818] border border-white/10 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c5a059]" />
                      Smart Internal Linking Recommendations
                    </h4>
                    <p className="text-xs text-white/50">
                      The analyzer scans your post body for Lucknow area names & target keywords to build internal link authority.
                    </p>
                  </div>

                  {internalLinkSuggestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-white/40 bg-[#181818] rounded-xl border border-white/10">
                      No matching location or profile keywords detected in post body. Mention areas like "Gomti Nagar", "Hazratganj", or "Alambagh".
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {internalLinkSuggestions.map((item, i) => (
                        <div key={i} className="p-3 bg-[#181818] border border-white/10 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-[#c5a059]">{item.keyword}</span>
                            <span className="text-white/40 block text-[11px] font-mono">Target: {item.url} ({item.target})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = editingBlog.content || '';
                              const replaced = current.replace(
                                new RegExp(item.keyword, 'i'),
                                `<a href="${item.url}" className="text-[#c5a059] underline font-bold">${item.keyword}</a>`
                              );
                              setEditingBlog({ ...editingBlog, content: replaced });
                              showToast(`Linked "${item.keyword}" to ${item.url}!`);
                            }}
                            className="px-3 py-1.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/30 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Auto-Link Keyphrase
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#c5a059]/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
