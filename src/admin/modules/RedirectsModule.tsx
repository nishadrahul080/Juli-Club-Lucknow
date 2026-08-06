import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { RedirectRule } from '../../types';
import { ArrowRightLeft, Plus, Trash2, Save, CheckCircle2, Search } from 'lucide-react';

export const RedirectsModule: React.FC = () => {
  const { cmsData, updateRedirects } = useCMS();
  const [redirects, setRedirects] = useState<RedirectRule[]>(cmsData.redirects || []);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newStatusCode, setNewStatusCode] = useState<301 | 302>(301);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newTo) return;

    const rule: RedirectRule = {
      id: `red-${Date.now()}`,
      fromSlug: newFrom.startsWith('/') ? newFrom : `/${newFrom}`,
      toTarget: newTo.startsWith('/') || newTo.startsWith('http') ? newTo : `/${newTo}`,
      statusCode: newStatusCode,
      isActive: true
    };

    const updated = [rule, ...redirects];
    setRedirects(updated);
    try {
      await updateRedirects(updated);
      setNewFrom('');
      setNewTo('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save redirect to database: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id: string) => {
    const updated = redirects.filter(r => r.id !== id);
    setRedirects(updated);
    try {
      await updateRedirects(updated);
    } catch (err: any) {
      alert('Failed to delete redirect: ' + (err.message || 'Error'));
    }
  };

  const handleToggle = async (id: string) => {
    const updated = redirects.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r));
    setRedirects(updated);
    try {
      await updateRedirects(updated);
    } catch (err: any) {
      alert('Failed to update redirect: ' + (err.message || 'Error'));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">SEO URL Redirects Manager</h2>
            <p className="text-xs text-white/60">
              Manage 301 Permanent and 302 Temporary URL redirects to maintain SEO backlinks and prevent 404 errors.
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Redirect rule successfully created!</span>
        </div>
      )}

      {/* Add Redirect Form */}
      <form onSubmit={handleAddRedirect} className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#c5a059]" />
          Add New URL Redirect Rule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1">Old Request URL / Slug</label>
            <input
              type="text"
              placeholder="e.g. /escorts-gomti-nagar"
              value={newFrom}
              onChange={e => setNewFrom(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Target Redirect URL / Slug</label>
            <input
              type="text"
              placeholder="e.g. /call-girl-service-gomti-nagar"
              value={newTo}
              onChange={e => setNewTo(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono text-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">HTTP Status Code</label>
            <div className="flex gap-2">
              <select
                value={newStatusCode}
                onChange={e => setNewStatusCode(Number(e.target.value) as 301 | 302)}
                className="flex-1 bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
              >
                <option value={301}>301 Permanent Redirect</option>
                <option value={302}>302 Temporary Redirect</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-[#c5a059]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Redirect Rules Table */}
      <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-[#111]">
          <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
            Active Redirect Rules ({redirects.length})
          </h3>
        </div>

        {redirects.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs">
            No redirect rules created yet. Enter an old path and target URL above.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {redirects.map(rule => (
              <div key={rule.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 font-mono flex-1 min-w-0">
                  <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold">
                    {rule.statusCode}
                  </span>
                  <span className="text-white/80 truncate">{rule.fromSlug}</span>
                  <span className="text-white/40">→</span>
                  <span className="text-[#c5a059] font-bold truncate">{rule.toTarget}</span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      rule.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {rule.isActive ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
