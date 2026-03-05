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
        args: any;
        result_preview: string;
    }>;
}

const CanonResponseView = ({ response, messageId, sources, allSources, toolCalls }: CanonResponseViewProps) => {
    const [activeTab, setActiveTab] = useState<'answer' | 'sources' | 'excerpts'>('answer');


    return (
        <div className="flex flex-col items-start justify-center text-black rounded-3xl py-5 w-full max-w-none md:mx-auto lg:mx-auto">
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3`}
            >
                {/* <div className="leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {response}
                </div> */}

                {/* tabs - Answer, sources, excerpts - desktop view */}
                <div className="flex items-center flex-col md:flex-row lg:flex-row gap-3 mb-4 md:mb-0 md:gap-4 lg:gap-4">

                    {/* Answer */}
                    <div className="rounded-lg transition">
                        <button
                            onClick={() => setActiveTab('answer')}
                            className={`relative group font-helvetica flex items-center px-3 py-1.5 rounded-lg focus:outline-none transition-colors
                                ${activeTab === 'answer' ? 'text-black font-medium' : 'text-black hover:font-medium'}
                            `}
                        >
                            <span>Answer</span>
                            <span
                                className={`absolute bottom-0 left-0 h-[2px] w-full bg-gray-500 transition-transform duration-300 origin-left
                                    ${activeTab === 'answer' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Sources */}
                    <div className="rounded-lg transition">
                        <button
                            onClick={() => setActiveTab('sources')}
                            className={`relative group font-helvetica flex items-center px-3 py-1.5 rounded-lg focus:outline-none transition-colors
                                ${activeTab === 'sources' ? 'text-black font-medium' : 'text-black hover:font-medium'}
                            `}
                        >
                            <span className="ml-1">Sources</span>
                            <span
                                className={`absolute bottom-0 left-0 h-[2px] w-full bg-gray-500 transition-transform duration-300 origin-left
                                    ${activeTab === 'sources' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Excerpts */}
                    <div className="rounded-lg transition">
                        <button
                            onClick={() => setActiveTab('excerpts')}
                            className={`relative group font-helvetica flex items-center px-3 py-1.5 rounded-lg focus:outline-none transition-colors
                                ${activeTab === 'excerpts' ? 'text-black font-medium' : 'text-black hover:font-medium'}
                            `}
                        >
                            <span className="ml-1">Excerpts</span>
                            <span
                                className={`absolute bottom-0 left-0 h-[2px] w-full bg-gray-500 transition-transform duration-300 origin-left
                                    ${activeTab === 'excerpts' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                `}
                            />
                        </button>
                    </div>
                </div>

                {/* Tab Content Sections - desktop view */}
                <div className="mt-6">
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

                {/* timestamp */}
                {/* <div className="text-xs text-[#717182] mb-1">
                                        {isUser ? "You" : ""}{" "}
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
                                    </div> */}
            </div>
        </div>
    )
}

export default CanonResponseView;