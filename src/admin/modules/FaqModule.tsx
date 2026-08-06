import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  HelpCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Folder,
  X,
  Save,
  Code,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const FaqModule: React.FC = () => {
  const { cmsData, updateFAQs } = useCMS();
  const faqs = cmsData.faqs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<{ id: string; question: string; answer: string; category: string } | null>(null);
  const [openPreviewIdx, setOpenPreviewIdx] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Booking & COD', 'Locations & Delivery', 'Companions & Safety', 'Pricing & Rates', 'Privacy & Security'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory !== 'All' && faq.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNewModal = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      category: 'Booking & COD',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: { id: string; question: string; answer: string; category: string }) => {
    setEditingFaq({ ...faq });
    setIsModalOpen(true);
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const updated = faqs.filter(f => f.id !== id);
      try {
        await updateFAQs(updated);
        showToast('FAQ deleted successfully');
      } catch (err: any) {
        alert('Failed to delete FAQ: ' + (err.message || 'Error'));
      }
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;

    const exists = faqs.some(f => f.id === editingFaq.id);
    let updatedList;
    if (exists) {
      updatedList = faqs.map(f => f.id === editingFaq.id ? editingFaq : f);
    } else {
      updatedList = [...faqs, editingFaq];
    }

    try {
      await updateFAQs(updatedList);
      showToast(exists ? 'FAQ updated successfully' : 'New FAQ created successfully');
      setIsModalOpen(false);
      setEditingFaq(null);
    } catch (err: any) {
      alert('Failed to save FAQ to database: ' + (err.message || 'Error'));
    }
  };

  // Generate structured FAQ JSON-LD schema
  const faqSchemaJson = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#c5a059] text-black font-bold text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f0f0f] p-6 rounded-lg border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#c5a059]" />
            <h1 className="text-xl sm:text-2xl font-serif text-[#e0e0e0]">FAQ Accordion & Rich Schema Manager</h1>
          </div>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Manage structured questions and answers to build Google Rich Snippets and address client inquiries.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Question
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Total FAQ Items</span>
          <span className="text-2xl font-serif font-bold text-[#e0e0e0] mt-1 block">{faqs.length}</span>
        </div>

        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Categories</span>
          <span className="text-2xl font-serif font-bold text-[#c5a059] mt-1 block">
            {new Set(faqs.map(f => f.category)).size}
          </span>
        </div>

        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Google Schema Status</span>
          <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Active JSON-LD
          </span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'bg-[#1a1a1a] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openPreviewIdx === idx;
          return (
            <div
              key={faq.id}
              className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden transition-colors hover:border-[#c5a059]/40"
            >
              <div className="p-4 flex items-start justify-between gap-4 bg-[#121212]">
                <button
                  onClick={() => setOpenPreviewIdx(isOpen ? null : idx)}
                  className="flex-1 text-left font-serif font-bold text-sm text-[#e0e0e0] hover:text-[#c5a059] flex items-center gap-3"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <span>{faq.question}</span>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded bg-[#1a1a1a] border border-white/10 text-[10px] text-[#c5a059] font-mono">
                    {faq.category || 'General'}
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(faq)}
                    className="p-1.5 text-white/60 hover:text-[#c5a059] hover:bg-white/5 rounded transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 pt-3 text-xs text-white/80 leading-relaxed font-sans bg-[#0a0a0a] border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-[#0f0f0f] border border-white/10 rounded-lg p-6 space-y-3">
            <HelpCircle className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="text-sm font-serif text-[#e0e0e0]">No FAQs Found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Try adjusting your category filter or click "Add New Question" to create a new FAQ item.
            </p>
          </div>
        )}
      </div>

      {/* Schema Markup Preview Box */}
      <div className="bg-[#0f0f0f] p-5 rounded-lg border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-2">
            <Code className="w-4 h-4" /> Live Google Rich Snippet FAQ Schema (JSON-LD)
          </h3>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
            Auto-Generated
          </span>
        </div>
        <pre className="bg-[#080808] p-4 rounded text-[11px] font-mono text-emerald-300/80 overflow-x-auto max-h-48 border border-white/5">
          {faqSchemaJson}
        </pre>
      </div>

      {/* Modal for New/Edit FAQ */}
      {isModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-[#e0e0e0]">
                {faqs.some(f => f.id === editingFaq.id) ? 'Edit FAQ Item' : 'Add New FAQ Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1 font-bold">Category</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#c5a059] font-bold focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} className="bg-[#0f0f0f]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-bold">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. How does 100% Cash on Delivery work in Lucknow?"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-bold">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Provide a clear, detailed answer for clients..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded p-3 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded flex items-center gap-2 uppercase tracking-wider"
                >
                  <Save className="w-4 h-4" />
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
