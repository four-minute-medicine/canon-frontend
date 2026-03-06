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
    if (!allSources || Object.keys(allSources).length === 0) {
        return (
            <div className="text-gray-600">
                No excerpts available for this response.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">
                    All Retrieved Excerpts ({Object.keys(allSources).length})
                </span>
            </div>
            <div className="space-y-3">
                {Object.entries(allSources).map(([sourceId, source]) => (
                    <div
                        key={sourceId}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-mono">
                                    [{sourceId}]
                                </span>
                                <span className="text-xs text-gray-600 font-medium">
                                    {source.source}
                                </span>
                                {source.page > 0 && (
                                    <span className="text-xs text-gray-500">
                                        Page {source.page}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                {source.rerank_score && (
                                    <span className="px-2 py-1 bg-gray-200 rounded">
                                        Score: {(source.rerank_score * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                        {source.section && (
                            <div className="text-xs text-gray-600 mb-2 font-medium">
                                {source.section}
                            </div>
                        )}
                        <MarkdownRenderer content={source.text} className="text-sm text-gray-700 leading-relaxed" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanonExcerpts;