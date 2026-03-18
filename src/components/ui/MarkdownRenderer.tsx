import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { fixMarkdown } from '@/lib/markdown'

interface MarkdownRendererProps {
  content: string
  className: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const fixedContent = fixMarkdown(content)

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
          ul: ({ ...props }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
          ),
          li: ({ ...props }) => <li {...props} />,
          h1: ({ ...props }) => (
            <h1 className="mb-3 text-2xl leading-tight font-semibold" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="mb-3 text-xl leading-tight font-semibold" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="mb-2 text-lg leading-tight font-semibold" {...props} />
          ),
          hr: ({ ...props }) => <hr className="my-5 border-black/20" {...props} />,
          strong: ({ ...props }) => (
            <strong className="font-semibold text-black" {...props} />
          ),
          a: ({ ...props }) => <a className="text-inherit no-underline" {...props} />,
          code: ({ ...props }) => (
            <code className="rounded bg-black/5 px-1 py-0.5 text-[0.95em]" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="my-4 border-l-2 border-black/15 pl-4 text-black/75"
              {...props}
            />
          ),
        }}
      >
        {fixedContent}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
