import React, { useState, useEffect } from 'react';
import { CMSSection, VersionSnapshot } from '../../types';
import { History, X, RotateCcw, Clock, Layers, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  pageId: string;
  currentSections: CMSSection[];
  onClose: () => void;
  onRestoreVersion: (sections: CMSSection[]) => void;
}

const STORAGE_KEY = 'juli_club_version_history';

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  pageId,
  currentSections,
  onClose,
  onRestoreVersion
}) => {
  if (!isOpen) return null;

  const [history, setHistory] = useState<VersionSnapshot[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionSnapshot | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${pageId}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Create initial current version snapshot
        const initialSnapshot: VersionSnapshot = {
          id: `ver-${Date.now()}`,
          pageId,
          timestamp: new Date().toLocaleString(),
          note: 'Initial state / Current active sections',
          sections: currentSections
        };
        setHistory([initialSnapshot]);
        localStorage.setItem(`${STORAGE_KEY}_${pageId}`, JSON.stringify([initialSnapshot]));
      }
    } catch {
      setHistory([]);
    }
  }, [pageId]);

  const handleRestore = (ver: VersionSnapshot) => {
    if (window.confirm(`Are you sure you want to restore the version from "${ver.timestamp}"?`)) {
      onRestoreVersion(ver.sections);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141414] border border-[#c5a059]/30 rounded-xl w-full max-w-4xl text-white shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Version History & Rollback Engine
              </h3>
              <p className="text-xs text-white/50">View auto-saved snapshots, compare differences, or restore previous versions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Left Panel: Versions Timeline */}
          <div className="border-r border-white/10 p-4 space-y-3 overflow-y-auto bg-[#0d0d0d]">
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block">
              Snapshot Timeline ({history.length})
            </span>

            {history.length === 0 ? (
              <p className="text-xs text-white/40 italic p-4 text-center">No version history recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((ver, idx) => {
                  const isSelected = selectedVersion?.id === ver.id;
                  return (
                    <div
                      key={ver.id}
                      onClick={() => setSelectedVersion(ver)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                          : 'bg-[#181818] border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-[#c5a059] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> #{history.length - idx}
                        </span>
                        <span className="text-[10px] text-white/40">{ver.sections.length} Sections</span>
                      </div>
                      <p className="text-xs text-white/90 font-medium">{ver.timestamp}</p>
                      {ver.note && <p className="text-[11px] text-white/50 truncate font-sans">{ver.note}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Version Details & Side-by-Side Comparison */}
          <div className="md:col-span-2 p-5 overflow-y-auto space-y-4 bg-[#141414] flex flex-col justify-between">
            {selectedVersion ? (
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Snapshot Details ({selectedVersion.timestamp})
                    </h4>
                    <p className="text-[11px] text-white/50">{selectedVersion.note || 'Auto-saved snapshot'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCompareMode(!compareMode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                        compareMode
                          ? 'bg-[#c5a059] text-black border-[#c5a059]'
                          : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Compare Mode</span>
                    </button>

                    <button
                      onClick={() => handleRestore(selectedVersion)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Snapshot</span>
                    </button>
                  </div>
                </div>

                {/* Compare Mode View */}
                {compareMode ? (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/10 space-y-2">
                      <span className="text-[10px] font-bold text-[#c5a059] uppercase block border-b border-white/10 pb-1">
                        Selected Version ({selectedVersion.sections.length} Sections)
                      </span>
                      <div className="space-y-1.5 max-h-80 overflow-y-auto text-xs">
                        {selectedVersion.sections.map((sec, idx) => (
                          <div key={idx} className="p-2 bg-white/5 rounded text-white/80 flex items-center justify-between">
                            <span className="font-serif font-bold">{sec.title || 'Untitled'}</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#c5a059]/20 text-[#c5a059] rounded">
                              {sec.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/10 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block border-b border-white/10 pb-1">
                        Current Active Version ({currentSections.length} Sections)
                      </span>
                      <div className="space-y-1.5 max-h-80 overflow-y-auto text-xs">
                        {currentSections.map((sec, idx) => (
                          <div key={idx} className="p-2 bg-white/5 rounded text-white/80 flex items-center justify-between">
                            <span className="font-serif font-bold">{sec.title || 'Untitled'}</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                              {sec.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Sections List View */
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                      Sections contained in this snapshot:
                    </span>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedVersion.sections.map((sec, idx) => (
                        <div key={idx} className="p-3 bg-[#0d0d0d] rounded-lg border border-white/10 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#c5a059] font-bold">#{sec.order}</span>
                              <h5 className="text-xs font-serif font-bold text-white">{sec.title || 'Untitled Section'}</h5>
                            </div>
                            <p className="text-[11px] text-white/50 truncate font-sans max-w-md">
                              {sec.description || sec.subtitle || 'No description copy'}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 bg-white/5 text-white/70 rounded text-[10px] uppercase font-mono border border-white/10 shrink-0">
                            {sec.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white/40 space-y-2">
                <Layers className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-xs">Select a version snapshot from the timeline on the left to inspect or restore.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
