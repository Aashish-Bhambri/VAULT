import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BotMessage = ({ content }) => {
  return (
    <div className="text-sm leading-relaxed text-[#F5F5F5] break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed text-[#F5F5F5]">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-[#FFFFFF]">{children}</strong>,
          h1: ({ children }) => <h1 className="text-lg font-bold text-[#F5F5F5] my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold text-[#F5F5F5] my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold text-[#19E6C1] my-1.5">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-[#A3A3A3]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-[#A3A3A3]">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-[#303030] bg-[#1B1B1B] shadow-inner">
              <table className="min-w-full text-xs text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#242424] text-[#19E6C1] font-semibold uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#303030]">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#202020] transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 text-xs font-semibold border-b border-[#303030] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2.5 text-xs text-[#A3A3A3] leading-normal">
              {children}
            </td>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="bg-[#1B1B1B] text-[#19E6C1] px-1.5 py-0.5 rounded text-xs font-mono border border-[#303030]">
                {children}
              </code>
            ) : (
              <pre className="bg-[#151515] border border-[#303030] rounded-xl p-3 my-2 overflow-x-auto text-xs text-[#19E6C1] font-mono">
                <code>{children}</code>
              </pre>
            ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[#19E6C1] underline hover:text-[#35F2D0] transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BotMessage;
