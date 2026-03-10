import { Zap } from 'lucide-react';

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;
    rerank_score?: number;
    keyword_matches?: number;
}

interface CanonSourcesProps {
    messageId: string;
    sources?: Record<string, Source>;
    toolCalls?: Array<{
        tool: string;
        args: Record<string, unknown> | null;
        result_preview: string;
    }>;
}

const CanonSources = ({ messageId, sources, toolCalls }: CanonSourcesProps) => {
    const groupedSources = Object.entries(sources || {}).reduce<Array<{
        label: string;
        sourceIds: string[];
        pages: number[];
        sections: string[];
    }>>((groups, [sourceId, source]) => {
        const label = source.source.replaceAll("-", " ");
        const existingGroup = groups.find((group) => group.label === label);

        if (existingGroup) {
            existingGroup.sourceIds.push(sourceId);

            if (source.page > 0 && !existingGroup.pages.includes(source.page)) {
                existingGroup.pages.push(source.page);
            }

            if (source.section && !existingGroup.sections.includes(source.section)) {
                existingGroup.sections.push(source.section);
            }

            return groups;
        }

        groups.push({
            label,
            sourceIds: [sourceId],
            pages: source.page > 0 ? [source.page] : [],
            sections: source.section ? [source.section] : [],
        });

        return groups;
    }, []);

    if ((!sources || Object.keys(sources).length === 0) && (!toolCalls || toolCalls.length === 0)) {
        return (
            <div className="text-sm text-[#666666]">
                No sources available for this response.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#5b6574]" />
                <span className="text-sm font-medium text-[#444444]">
                    Sources Found ({groupedSources.length})
                </span>
            </div>

            

            {(!sources || Object.keys(sources).length === 0) && (toolCalls && toolCalls.length > 0) &&
             (<div className="mt-2 text-sm text-[#666666]">
                No sources available for this response.
            </div>)}

            {/* sources */}
            <div className="space-y-3">
                {groupedSources.map((sourceGroup, index) => (
                    <div
                        key={sourceGroup.label}
                        className="rounded-[22px] border border-[#dddddd] bg-white/80 p-4 transition-colors"
                    >
                        {sourceGroup.sourceIds.map((sourceId) => (
                            <span
                                key={sourceId}
                                id={`source-${messageId}-${sourceId}`}
                                className="hidden"
                            />
                        ))}
                        <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-start gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#efefef] text-sm font-medium text-[#444444]">
                                    {index + 1}
                                </span>
                                <span className="text-[15px] font-medium text-[#222222] sm:text-base">
                                    {sourceGroup.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777]">
                                {sourceGroup.sourceIds.length > 1 && (
                                    <span>{sourceGroup.sourceIds.length} excerpts</span>
                                )}
                                {sourceGroup.pages.length > 0 && (
                                    <span>
                                        Pages {[...sourceGroup.pages].sort((a, b) => a - b).join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                        {sourceGroup.sections.length > 0 && (
                            <div className="mb-2 text-xs font-medium text-[#666666]">
                                Sections: {sourceGroup.sections.join(", ")}
                            </div>
                        )}
                        <div className="text-sm text-[#666666]">
                            Open the excerpts tab to read the full passage.
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanonSources;