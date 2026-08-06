import React from 'react';
import { useCMS } from '../context/CMSContext';
import { BlogPost } from '../data/cmsStore';
import { Calendar, Clock, User, ArrowRight, BookOpen, Sparkles, Tag } from 'lucide-react';

interface BlogSectionProps {
  onNavigateBlogArticle?: (slug: string) => void;
  onNavigateAllBlogs?: () => void;
  limit?: number;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onNavigateBlogArticle,
  onNavigateAllBlogs,
  limit = 3
}) => {
  const { cmsData, isPreviewMode } = useCMS();
  const blogs = cmsData.blogs || [];

  const visibleBlogs = blogs
    .filter(b => isPreviewMode || b.published || b.status === 'published')
    .slice(0, limit);

  if (visibleBlogs.length === 0) return null;

  return (
    <section className="py-16 bg-[#0a0a0a] text-[#e0e0e0] border-b border-white/10" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
              <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" /> Latest Articles & Guides
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0] mt-1">
              Lucknow Companion & Nightlife Blog
            </h2>
            <p className="text-xs text-white/60 font-sans">
              Expert guides on cash-on-delivery safety, hotel outcalls, dating etiquette, and Lucknow nightlife.
            </p>
          </div>

          {onNavigateAllBlogs && (
            <button
              onClick={onNavigateAllBlogs}
              className="px-5 py-2.5 bg-white/5 hover:bg-[#c5a059] text-white hover:text-black border border-white/10 hover:border-[#c5a059] font-bold rounded-sm text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shrink-0"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => onNavigateBlogArticle && onNavigateBlogArticle(blog.slug)}
              className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden group hover:border-[#c5a059]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Image & Category Tag */}
                <div className="relative aspect-video overflow-hidden bg-[#161616]">
                  <img
                    src={blog.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0a0a0a]/90 text-[#c5a059] border border-[#c5a059]/40 text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider backdrop-blur-md">
                    {blog.category || 'Lucknow Guide'}
                  </span>
                  {blog.isFeatured && (
                    <span className="absolute top-3 right-3 bg-[#c5a059] text-black font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-white/50 font-sans">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#c5a059]" /> {blog.author || 'Admin'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/30" /> {blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-white/30" /> {blog.readingTime || '4 min read'}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#e0e0e0] group-hover:text-[#c5a059] transition-colors leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-white/60 font-sans leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="p-5 pt-0 border-t border-white/5 mt-3 flex items-center justify-between text-xs text-[#c5a059] font-bold">
                <span className="group-hover:underline">Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
