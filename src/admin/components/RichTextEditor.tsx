import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Table as TableIcon,
  Eye,
  Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 8
}) => {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');

  const insertTag = (openTag: string, closeTag: string = '') => {
    const activeText = value || '';
    if (closeTag) {
      onChange(`${activeText}${openTag}Selected Text${closeTag}`);
    } else {
      onChange(`${activeText}${openTag}`);
    }
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter link URL (Internal e.g. /#profiles or External e.g. https://...):');
    if (url) {
      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      insertTag(`<a href="${url}"${target} class="text-[#c5a059] underline hover:opacity-80">`, '</a>');
    }
  };

  const handleImageInsert = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      const alt = window.prompt('Enter Image Alt Text (optional):') || 'Content image';
      insertTag(`<img src="${url}" alt="${alt}" class="w-full max-w-2xl rounded-lg my-4 border border-white/10" />\n`);
    }
  };

  const handleVideoInsert = () => {
    const url = window.prompt('Enter YouTube Embed URL or Video URL:');
    if (url) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let embedUrl = url;
        if (url.includes('watch?v=')) {
          embedUrl = url.replace('watch?v=', 'embed/');
        }
        insertTag(`<div class="aspect-video w-full my-4 rounded-lg overflow-hidden border border-white/10"><iframe src="${embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>\n`);
      } else {
        insertTag(`<video src="${url}" controls class="w-full rounded-lg my-4 border border-white/10"></video>\n`);
      }
    }
  };

  const handleTableInsert = () => {
    const tableHtml = `
<div class="overflow-x-auto my-4">
  <table class="w-full text-left text-xs border-collapse border border-white/15">
    <thead>
      <tr class="bg-white/5 border-b border-white/15 text-[#c5a059]">
        <th class="p-2.5 border-r border-white/15">Header 1</th>
        <th class="p-2.5 border-r border-white/15">Header 2</th>
        <th class="p-2.5">Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-white/10">
        <td class="p-2.5 border-r border-white/10">Data 1</td>
        <td class="p-2.5 border-r border-white/10">Data 2</td>
        <td class="p-2.5">Data 3</td>
      </tr>
    </tbody>
  </table>
</div>
`;
    onChange((value || '') + tableHtml);
  };

  return (
    <div className="border border-white/15 rounded-lg bg-[#0f0f0f] overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="bg-[#161616] border-b border-white/10 p-2 flex flex-wrap items-center justify-between gap-1 text-white/80 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center bg-white/5 rounded border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => insertTag('<h1 class="text-2xl font-serif font-bold text-white mb-3">', '</h1>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h2 class="text-xl font-serif font-bold text-white mb-2">', '</h2>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h3 class="text-lg font-serif font-bold text-[#c5a059] mb-2">', '</h3>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h4 class="text-base font-bold text-white mb-1">', '</h4>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 4"
            >
              <Heading4 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h5 class="text-sm font-bold text-white/90 mb-1">', '</h5>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 5"
            >
              <Heading5 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h6 class="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-1">', '</h6>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Heading 6"
            >
              <Heading6 className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Formats */}
          <div className="flex items-center bg-white/5 rounded border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => insertTag('<strong>', '</strong>')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<em>', '</em>')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<u>', '</u>')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<code class="bg-black/50 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-xs">', '</code>')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Code Inline"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Lists & Quotes */}
          <div className="flex items-center bg-white/5 rounded border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => insertTag('<ul class="list-disc list-inside space-y-1 my-2 text-white/80">\n  <li>', '</li>\n</ul>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<ol class="list-decimal list-inside space-y-1 my-2 text-white/80">\n  <li>', '</li>\n</ol>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<blockquote class="border-l-2 border-[#c5a059] pl-4 py-2 italic text-white/70 bg-white/5 my-3 rounded-r">\n  ', '\n</blockquote>\n')}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Media & Objects */}
          <div className="flex items-center bg-white/5 rounded border border-white/10 p-0.5">
            <button
              type="button"
              onClick={handleLinkInsert}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Insert Link (Internal/External)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleImageInsert}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Insert Image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleVideoInsert}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Insert Video Embed"
            >
              <VideoIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleTableInsert}
              className="p-1 hover:bg-white/10 rounded text-xs hover:text-[#c5a059]"
              title="Insert Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual vs Code Mode toggle */}
        <div className="flex items-center bg-white/5 rounded border border-white/10 p-0.5 text-[10px] uppercase font-bold">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
              mode === 'visual' ? 'bg-[#c5a059] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
              mode === 'code' ? 'bg-[#c5a059] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Code className="w-3 h-3" /> HTML Code
          </button>
        </div>
      </div>

      {/* Main Text Input / Visual Preview */}
      {mode === 'code' ? (
        <textarea
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#0a0a0a] p-3 text-xs text-emerald-400 font-mono outline-none resize-none leading-relaxed flex-1"
        />
      ) : (
        <div className="flex-1 flex flex-col">
          <textarea
            rows={rows}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#0d0d0d] p-3 text-xs text-white/90 font-sans outline-none resize-none leading-relaxed flex-1"
          />
          {value && (
            <div className="p-3 bg-black/40 border-t border-white/10 text-xs text-white/80 space-y-1 max-h-48 overflow-y-auto">
              <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block">Live Rendered Preview:</span>
              <div
                className="prose prose-invert prose-xs max-w-none font-sans"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
