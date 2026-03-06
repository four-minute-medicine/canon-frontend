import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { fixMarkdown } from './common';


interface MarkdownRendererProps {
    content: string;
    className: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className,
}) => {
    let fixedContent = content;
    // Check if there is a '**' followed by a line break to fix formatting
    if (/\*\*\s*\n/.test(content)) {
        fixedContent = fixMarkdown(content);
    }

    // if (isInline) {
    //     return (
    //         <span className={className}>
    //             <ReactMarkdown
    //                 remarkPlugins={[remarkMath, remarkGfm]}
    //                 rehypePlugins={[rehypeKatex]}
    //                 components={{
    //                     p: ({node, ...props}) => <span {...props} />,
    //                     ul: ({node, ...props}) => <span {...props} />,
    //                     ol: ({node, ...props}) => <span {...props} />,
    //                 }}
    //             >
    //                 {fixedContent}
    //             </ReactMarkdown>
    //         </span>
    //     );
    // }

    return (
        <div className={className}>
            <ReactMarkdown
                // Process Markdown tables and other GitHub Flavored Markdown
                remarkPlugins={[remarkMath, remarkGfm]}
                // Render math nodes using KaTeX
                rehypePlugins={[rehypeKatex]}
            >
                {fixedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;