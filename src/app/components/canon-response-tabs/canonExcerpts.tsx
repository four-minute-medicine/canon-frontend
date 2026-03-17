import MarkdownRenderer from '@/app/utils/markdownRenderer';

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;
    rerank_score?: number;
    keyword_matches?: number;
    url?: string;
}

interface CanonExcerptsProps {
    allSources?: Record<string, Source>;
}

const CanonExcerpts = ({ allSources }: CanonExcerptsProps) => {
    const sourceIds = Object.keys(allSources || {});
    
    // Group and merge consecutive excerpts
    const mergedExcerpts = Object.entries(allSources || {}).reduce<Array<{
        sourceIds: string[];
        source: string;
        pages: number[];
        sections: string[];
        combinedText: string;
        avgScore?: number;
    }>>((groups, [sourceId, source]) => {
        const lastGroup = groups[groups.length - 1];
        
        // Check if this excerpt should be merged with the previous one
        const shouldMerge = lastGroup && 
            lastGroup.source === source.source && 
            (
                // Same page and section
                (lastGroup.pages.includes(source.page) && lastGroup.sections.includes(source.section)) ||
                // Consecutive pages
                Math.abs(Math.max(...lastGroup.pages) - source.page) <= 1 ||
                // Same section name (even different pages)
                (source.section && lastGroup.sections.includes(source.section))
            );

        if (shouldMerge) {
            // Merge with previous group
            lastGroup.sourceIds.push(sourceId);
            if (!lastGroup.pages.includes(source.page)) {
                lastGroup.pages.push(source.page);
            }
            if (source.section && !lastGroup.sections.includes(source.section)) {
                lastGroup.sections.push(source.section);
            }
            // Combine text with smooth transition and clean up formatting
            let newText = source.text.trim();
            
            // Clean up common formatting issues
            newText = newText
                .replace(/```\*\*$/g, '')  // Remove trailing ```**
                .replace(/^\*\*```/g, '') // Remove leading **```
                .replace(/o\s+/g, '• ')   // Convert 'o ' to bullet points
                .replace(/\s*\n\s*\n\s*/g, '\n\n') // Clean up multiple newlines
                .replace(/\s*\n\s*-\s*/g, '\n- ') // Clean up list formatting
                .trim();
            
            // Add smooth transition
            const needsSpace = !newText.match(/^[.,:;!?)]/) && 
                              !lastGroup.combinedText.match(/[.!?]\s*$/);
            
            lastGroup.combinedText += needsSpace ? ` ${newText}` : newText;
            
            // Update average score
            if (source.rerank_score && lastGroup.avgScore) {
                const totalSources = lastGroup.sourceIds.length;
                lastGroup.avgScore = ((lastGroup.avgScore * (totalSources - 1)) + source.rerank_score) / totalSources;
            }
        } else {
            // Create new group with cleaned text
            let cleanText = source.text
                .replace(/```\*\*$/g, '')  // Remove trailing ```**
                .replace(/^\*\*```/g, '') // Remove leading **```
                .replace(/o\s+/g, '• ')   // Convert 'o ' to bullet points
                .replace(/\s*\n\s*\n\s*/g, '\n\n') // Clean up multiple newlines
                .replace(/\s*\n\s*-\s*/g, '\n- ') // Clean up list formatting
                .trim();
                
            groups.push({
                sourceIds: [sourceId],
                source: source.source,
                pages: [source.page],
                sections: source.section ? [source.section] : [],
                combinedText: cleanText,
                avgScore: source.rerank_score,
            });
        }

        return groups;
    }, []);

    if (!allSources || Object.keys(allSources).length === 0) {
        return (
            <div className="text-sm text-[#666666]">
                No excerpts available for this response.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-[#444444]">
                    All Retrieved Excerpts ({mergedExcerpts.length} merged sections)
                </span>
            </div>
            <div className="space-y-4">
                {mergedExcerpts.map((excerpt, index) => (
                    <div
                        key={`merged-${index}`}
                        className="rounded-[22px] border border-[#dddddd] bg-white/80 p-5 transition-colors overflow-hidden"
                    >
                        <div className="mb-3 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efefef] text-sm font-medium text-[#444444]">
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-[#222222] leading-tight">
                                        {excerpt.source.replaceAll("-", " ")}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#777777]">
                                        {excerpt.pages.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Pages:</span>
                                                {excerpt.pages.length === 1 ? (
                                                    <span>{excerpt.pages[0]}</span>
                                                ) : (
                                                    <span>{Math.min(...excerpt.pages)}-{Math.max(...excerpt.pages)}</span>
                                                )}
                                            </span>
                                        )}
                                        {excerpt.sections.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Sections:</span>
                                                <span className="italic">{excerpt.sections.join(", ")}</span>
                                            </span>
                                        )}
                                        {excerpt.sourceIds.length > 1 && (
                                            <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-xs">
                                                {excerpt.sourceIds.length} excerpts merged
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {excerpt.avgScore && (
                                <div className="ml-11 flex items-center gap-2">
                                    <span className="rounded-full bg-[#e8f5e8] px-3 py-1 text-xs font-medium text-[#2d5a2d]">
                                        Relevance: {(excerpt.avgScore * 100).toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="ml-11">
                            <MarkdownRenderer 
                                content={excerpt.combinedText} 
                                className="text-[15px] leading-7 text-[#333333] prose prose-sm max-w-none 
                                          prose-p:mb-3 prose-strong:text-[#222222] prose-em:text-[#555555]
                                          prose-code:bg-[#f5f5f5] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                          prose-pre:bg-[#f8f8f8] prose-pre:border prose-pre:border-[#e0e0e0] prose-pre:rounded-lg prose-pre:p-3
                                          prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:max-w-full
                                          break-words overflow-wrap-anywhere whitespace-pre-wrap
                                          [&_*]:max-w-full [&_pre]:!whitespace-pre-wrap [&_code]:!whitespace-pre-wrap" 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanonExcerpts;