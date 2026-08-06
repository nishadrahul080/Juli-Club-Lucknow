import React from 'react';
import { BlogPost } from '../data/cmsStore';
import { Calendar, Clock, User, ArrowLeft, BookOpen, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCMS } from '../context/CMSContext';

interface BlogPageViewProps {
  post: BlogPost;
  onNavigateHome: () => void;
  onNavigateBlogList: () => void;
  onNavigateBlogArticle: (slug: string) => void;
}

export const BlogPageView: React.FC<BlogPageViewProps> = ({
  post,
  onNavigateHome,
  onNavigateBlogList,
  onNavigateBlogArticle,
}) => {
  const { cmsData } = useCMS();
  const allBlogs = cmsData.blogs || [];

  const relatedPosts = allBlogs
    .filter(b => b.slug !== post.slug)
    .slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: post.author || 'Juli Club Lucknow',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Juli Club Lucknow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://juli-club.com/logo.png',
      },
    },
    datePublished: post.date,
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#e0e0e0] py-8 sm:py-12 border-b border-white/10">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50">
            <button onClick={onNavigateHome} className="hover:text-[#c5a059] transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={onNavigateBlogList} className="hover:text-[#c5a059] transition-colors">
              Blog
            </button>
            <span>/</span>
            <span className="text-[#c5a059] truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </div>

          <button
            onClick={onNavigateBlogList}
            className="inline-flex items-center gap-1.5 text-xs text-[#c5a059] hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
          </button>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" /> {post.category || 'Lucknow Companion Guide'}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#e0e0e0] font-bold leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 font-sans border-y border-white/10 py-3">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#c5a059]" /> {post.author || 'Admin'}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/40" /> {post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white/40" /> {post.readingTime || '5 min read'}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Box */}
        <div className="bg-[#121212] p-5 rounded-lg border-l-4 border-[#c5a059] text-sm text-white/90 italic font-sans leading-relaxed">
          "{post.excerpt}"
        </div>

        {/* Main Article Body Content */}
        <article className="prose prose-invert max-w-none space-y-6 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-serif text-[#c5a059] font-bold pt-4 pb-1 border-b border-white/10">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg font-serif text-[#e0e0e0] font-bold pt-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="leading-relaxed text-white/85">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* WhatsApp Booking CTA Box */}
        <div className="bg-[#0f0f0f] border border-[#25D366]/40 p-6 rounded-lg text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
            <CheckCircle2 className="w-4 h-4" /> Ready to Book in Lucknow?
          </div>
          <h3 className="text-xl font-serif text-[#e0e0e0]">
            Get 100% Cash on Delivery Companion Service
          </h3>
          <p className="text-xs text-white/70 max-w-lg mx-auto font-sans">
            Connect directly with verified independent companions, college escorts, and 5-star hotel models with zero advance payment and free driver pickup.
          </p>
          <a
            href="https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20read%20your%20blog%20article%20and%20want%20to%20book%20a%20Cash%20on%20Delivery%20Companion."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold rounded-md text-xs uppercase tracking-wider shadow-lg"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Chat via WhatsApp Now</span>
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/10">
            <h3 className="text-lg font-serif font-bold text-[#e0e0e0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#c5a059]" /> More Recommended Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateBlogArticle(rel.slug)}
                  className="bg-[#0f0f0f] p-4 rounded border border-white/10 hover:border-[#c5a059] transition-colors cursor-pointer space-y-2"
                >
                  <span className="text-[9px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-serif font-bold text-[#e0e0e0] line-clamp-2 hover:text-[#c5a059]">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-white/40 block">{rel.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
