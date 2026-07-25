"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  theme?: "light" | "dark";
}

export function MarkdownContent({
  content,
  className,
  theme = "light",
}: MarkdownContentProps) {
  const isDark = theme === "dark";

  return (
    <article
      className={cn(
        "blog-prose",
        isDark ? "blog-prose-dark" : "blog-prose-light",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="blog-prose-h2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="blog-prose-h3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="blog-prose-h4">{children}</h4>
          ),
          p: ({ children }) => <p className="blog-prose-p">{children}</p>,
          ul: ({ children }) => <ul className="blog-prose-ul">{children}</ul>,
          ol: ({ children }) => <ol className="blog-prose-ol">{children}</ol>,
          li: ({ children }) => <li className="blog-prose-li">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="blog-prose-blockquote">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="blog-prose-table-wrap">
              <table className="blog-prose-table">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="blog-prose-thead">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="blog-prose-tr">{children}</tr>,
          th: ({ children }) => <th className="blog-prose-th">{children}</th>,
          td: ({ children }) => <td className="blog-prose-td">{children}</td>,
          code: ({ className: codeClass, children, ...props }) => {
            const isBlock = codeClass?.includes("language-");
            if (isBlock) {
              return (
                <pre className="blog-prose-pre">
                  <code className={cn("blog-prose-code", codeClass)} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className="blog-prose-inline-code" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="blog-prose-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="blog-prose-hr" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-inherit">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
