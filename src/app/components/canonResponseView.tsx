import { useState } from "react";
import CanonAnswer from "./canon-response-tabs/canonAnswer";
import CanonSources from "./canon-response-tabs/canonSources";
import CanonExcerpts from "./canon-response-tabs/canonExcerpts";

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;
    rerank_score?: number;
    keyword_matches?: number;
}

interface CanonResponseViewProps {
    response: string;
    messageId: string;
    sources: Record<string, Source>;
    allSources: Record<string, Source>;
    toolCalls: Array<{
        tool: string;
        args: Record<string, unknown> | null;
        result_preview: string;
    }>;
    isMobile: boolean;
}

const CanonResponseView = ({ response, messageId, sources, allSources, toolCalls, isMobile }: CanonResponseViewProps) => {
    const [activeTab, setActiveTab] = useState<'answer' | 'sources' | 'excerpts'>('answer');


    return (
        <div className="w-full max-w-4xl py-2 text-black">
            <div className={`mb-3 flex flex-wrap items-center gap-5 px-2 ${isMobile ? "justify-start" : ""}`}>
                {(['answer', 'sources', 'excerpts'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`border-b pb-1 text-[15px] transition-colors ${
                            activeTab === tab
                                ? 'border-black font-semibold text-black'
                                : 'border-transparent text-black/75 hover:text-black'
                        }`}
                    >
                        {tab === 'answer' ? 'Answer' : tab === 'sources' ? 'Sources' : 'Excerpts'}
                    </button>
                ))}
            </div>

            <div className="w-full rounded-[30px] bg-[#f3f3f3] px-4 py-4 sm:px-5 sm:py-5">
                <div className="space-y-3">
                    {toolCalls && toolCalls.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {toolCalls.map((tool, index) => (
                                <span
                                    key={`${tool.tool}-${index}`}
                                    className="rounded-full bg-[#e6e6e6] px-3 py-1 text-sm text-[#3a3a3a]"
                                >
                                    {tool.tool.replaceAll('_', ' ')}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-3">
                    {activeTab === 'answer' && (
                        <CanonAnswer
                            response={response}
                            messageId={messageId}
                            sources={sources}
                        />
                    )}

                    {activeTab === 'sources' && (
                        <CanonSources
                            messageId={messageId}
                            sources={sources}
                            toolCalls={toolCalls}
                        />
                    )}

                    {activeTab === 'excerpts' && (
                        <CanonExcerpts
                            allSources={allSources}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CanonResponseView;