import { Zap } from 'lucide-react';
import MarkdownRenderer from '@/app/utils/markdownRenderer';

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
        args: any;
        result_preview: string;
    }>;
}

const CanonSources = ({ messageId, sources, toolCalls }: CanonSourcesProps) => {
    console.log("toolCalls", toolCalls);
    if ((!sources || Object.keys(sources).length === 0) && (!toolCalls || toolCalls.length === 0)) {
        return (
            <div className="text-gray-600">
                No sources available for this response.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                    Sources Found ({!sources ? 0 : Object.keys(sources).length})
                </span>
            </div>

            {/* tool name pills */}
            <div className="flex items-center space-x-2 mt-2">
                {toolCalls?.map((tool, index) => (
                    <span key={index} className="text-sm font-medium text-black px-3 py-2 rounded-full bg-gray-200">
                        {tool.tool}
                    </span>
                ))}
            </div>

            {(!sources || Object.keys(sources).length === 0) && (toolCalls && toolCalls.length > 0) &&
             (<div className="text-gray-600 mt-2">
                No sources available for this response.
            </div>)}

            {/* sources */}
            <div className="space-y-3">
                {sources && Object.entries(sources).map(([sourceId, source], index) => (
                    <div
                        key={sourceId}
                        id={`source-${messageId}-${sourceId}`}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        <div className="flex flex-col items-start justify-between mb-2">
                            <div className="flex items-start space-x-2">
                                <span className="px-2 py-1 text-sm rounded font-mono">
                                    {/* [{sourceId}] */}
                                    {index + 1}.
                                </span>
                                <span className="text-base">
                                    {source.source.replaceAll("-", " ")} {source.page > 0 && `• Page ${source.page}`}
                                </span>
                            </div>
                            <div className="flex items-center justify-end space-x-2 text-xs text-gray-500">
                                {source.rerank_score && (
                                    <span>Relevance: {(source.rerank_score * 100).toFixed(1)}%</span>
                                )}
                                {source.keyword_matches && (
                                    <span>Keywords: {source.keyword_matches}</span>
                                )}
                            </div>
                        </div>
                        {source.section && (
                            <div className="text-xs text-blue-600 mb-2 font-medium">
                                Section: {source.section}
                            </div>
                        )}
                        {/* <MarkdownRenderer content={source.text} className="text-sm text-gray-700 leading-relaxed" /> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanonSources;