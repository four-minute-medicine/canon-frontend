import MarkdownRenderer from '@/app/utils/markdownRenderer';

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;    
    rerank_score?: number;
    keyword_matches?: number;
}

interface CanonAnswerProps {
    response: string;
    messageId: string;
    sources?: Record<string, Source>;
}

const CanonAnswer = ({ response, messageId, sources }: CanonAnswerProps) => {
    // console.log("response", response);
    return (
        <div className="flex flex-col items-start justify-center text-black rounded-3xl py-5 w-full max-w-none md:mx-auto lg:mx-auto">
            {/* Main content with enhanced citation formatting */}
            <div className="leading-relaxed whitespace-pre-wrap">
                {response.split(/(\[[a-f0-9]{4}\])/g).map((part, index) => {
                    const sourceMatch = part.match(/\[([a-f0-9]{4})\]/);
                    if (sourceMatch && sources && sources[sourceMatch[1]]) {
                        const sourceId = sourceMatch[1];
                        const source = sources[sourceId];
                        return (
                            <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 bg-blue-600/20 text-blue-600 text-xs rounded border border-blue-600/30 cursor-pointer hover:bg-blue-600/30 transition-colors"
                                onClick={() => {
                                    // Scroll to corresponding source card
                                    const sourceCard = document.getElementById(`source-${messageId}-${sourceId}`);
                                    sourceCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                title={`${source.source} - Page ${source.page}`}
                            >
                                <MarkdownRenderer content={part} className="text-sm" />
                            </span>
                        );
                    }
                    return <MarkdownRenderer key={index} content={part} className="text-sm" />;
                })}
            </div>
        </div>
    );
};

export default CanonAnswer;