import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;    
    rerank_score?: number;
    keyword_matches?: number;
    url?: string;
}

interface CanonAnswerProps {
    response: string;
    messageId: string;
    sources?: Record<string, Source>;
}

const CanonAnswer = ({ response, messageId, sources }: CanonAnswerProps) => {
    const sourceIds = Object.keys(sources || {});
    const citationNumbers = sourceIds.reduce<Record<string, number>>((acc, sourceId, index) => {
        acc[sourceId] = index + 1;
        return acc;
    }, {});
    const cleanedResponse = response
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/<\/?think>/gi, '')
        .replace(/\[([^\]]+)\]/g, (fullMatch, sourceId: string) => {
            const citationNumber = citationNumbers[sourceId];
            if (!citationNumber) {
                return fullMatch;
            }

            return `<a href="#source-${messageId}-${sourceId}" class="inline-flex h-4 min-w-4 -translate-y-1/3 items-center justify-center rounded-full bg-[#D9D9D9] px-1 text-[0.5em] font-medium leading-none text-[#222222] align-top">${citationNumber}</a>`;
        })
        .trim();

    return (
        <div className="w-full">
            <MarkdownRenderer
                content={cleanedResponse}
                className="text-[15px] leading-7 text-[#222222] sm:text-base"
            />
        </div>
    );
};

export default CanonAnswer;