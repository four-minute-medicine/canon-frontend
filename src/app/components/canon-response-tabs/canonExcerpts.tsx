import MarkdownRenderer from '@/app/utils/markdownRenderer';

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;
    rerank_score?: number;
    keyword_matches?: number;
}

interface CanonExcerptsProps {
    allSources?: Record<string, Source>;
}

const CanonExcerpts = ({ allSources }: CanonExcerptsProps) => {
    const sourceIds = Object.keys(allSources || {});
    const citationNumbers = sourceIds.reduce<Record<string, number>>((acc, sourceId, index) => {
        acc[sourceId] = index + 1;
        return acc;
    }, {});

    if (!allSources || Object.keys(allSources).length === 0) {
        return (
            <div className="text-sm text-[#666666]">
                No excerpts available for this response.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-[#444444]">
                    All Retrieved Excerpts ({Object.keys(allSources).length})
                </span>
            </div>
            <div className="space-y-3">
                {Object.entries(allSources).map(([sourceId, source]) => (
                    <div
                        key={sourceId}
                        className="rounded-[22px] border border-[#dddddd] bg-white/80 p-4 transition-colors"
                    >
                        <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#efefef] text-sm font-medium text-[#444444]">
                                    {citationNumbers[sourceId]}
                                </span>
                                <span className="text-sm font-medium text-[#222222]">
                                    {source.source.replaceAll("-", " ")}
                                </span>
                                {source.page > 0 && (
                                    <span className="text-xs text-[#777777]">
                                        Page {source.page}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777]">
                                {source.rerank_score && (
                                    <span className="rounded-full bg-[#efefef] px-2 py-1">
                                        Score: {(source.rerank_score * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                        {source.section && (
                            <div className="mb-2 text-xs font-medium text-[#666666]">
                                {source.section}
                            </div>
                        )}
                        <MarkdownRenderer content={source.text} className="text-[15px] leading-7 text-[#333333]" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanonExcerpts;