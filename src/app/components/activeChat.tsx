import { useEffect, useRef } from "react";
import { GrMicrophone } from "react-icons/gr";
import { HiArrowUp } from "react-icons/hi";
import CanonResponseView from "./canonResponseView";


interface ActiveChatProps {
    messages: Message[];
    isResponding: boolean;
    isMobile: boolean;
    inputMessage: string;
    setInputMessage: (value: string) => void;
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface Message {
    id: string;
    message: string;
    sender: string;
    timestamp: Date;
    sources?: Record<string, Source>;
    all_sources?: Record<string, Source>;
    tool_calls?: Array<{
        tool: string;
        args: Record<string, unknown> | null;
        result_preview: string;
    }>;
    rounds?: number;
}

interface Source {
    text: string;
    source: string;
    page: number;
    section: string;
    rerank_score?: number;
    keyword_matches?: number;
    url?: string;
}

const ActiveChat = ({ messages, isResponding = false, handleSendMessage, handleKeyPress, inputMessage, setInputMessage, isMobile }: ActiveChatProps) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isResponding]);

    return (
        <div className="flex min-h-0 flex-1 flex-col border-t border-black/5">
            <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-10">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
                {messages.map((msg) => {
                    const isUser = msg.sender !== "bot";
                    const introMessage = msg.id === "1" && !isUser;

                    if (isUser) {
                        return (
                            <div
                                key={msg.id}
                                className="w-full max-w-3xl"
                            >
                                    <div className="wrap-break-word whitespace-pre-wrap text-[15px] leading-7 text-black sm:text-base">
                                            {msg.message}
                                    </div>
                                    <div className="mt-1 text-sm text-[#7a7a7a]">
                                        You
                                    </div>
                            </div>

                        );
                    } else if (introMessage) {
                        return (
                            <div
                                key={msg.id}
                                className="w-full max-w-4xl"
                            >
                                    <div
                                        className="rounded-[28px] bg-[#f3f3f3] px-5 py-5 text-black sm:px-6 sm:py-6"
                                    >
                                        <div className="wrap-break-word whitespace-pre-wrap text-[15px] leading-7 text-[#222222] sm:text-base">
                                            {msg.message}
                                        </div>
                                    </div>
                            </div>
                        );
                    } else {

                        return <CanonResponseView
                            key={msg.id}
                            isMobile={isMobile}
                            response={msg.message}
                            messageId={msg.id}
                            sources={msg.sources || {}}
                            allSources={msg.all_sources || {}}
                            toolCalls={msg.tool_calls || []}
                        />
                    }


                })}

                {isResponding && (
                    <div className="flex w-full justify-start">
                        <div className="rounded-full bg-[#ececec] px-4 py-2 text-sm text-[#666666] animate-pulse">
                            Formulating response
                        </div>
                    </div>
                )}
                </div>
                <div ref={endRef} />
            </div>

            {/* Chat Input */}
            <div className="sticky bottom-0 border-t border-black/5 bg-[#f7f7f7]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
                <div className="mx-auto flex w-full max-w-5xl items-end gap-2 rounded-[28px] border border-[#d7d7d7] bg-white px-4 py-3 shadow-sm transition-all duration-200 ease-in-out hover:border-[#c0c0c0] hover:shadow-md focus-within:border-blue-500 focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20 sm:gap-3 sm:px-6 sm:py-4">
                    <textarea
                        placeholder={isResponding ? "Replying..." : "Ask Anything..."}
                        className="custom-scrollbar min-h-[40px] max-h-[140px] w-full resize-none border-none bg-transparent py-2 text-[15px] leading-6 text-[#444444] outline-none placeholder:text-[#9a9a9a] focus:ring-0 transition-colors duration-200"
                        rows={1}
                        onKeyPress={handleKeyPress}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />

                    {/* mic button */}
                    <button
                        className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:hover:bg-transparent"
                        disabled={isResponding}
                    >
                        <GrMicrophone className="text-[#5b6574] transition-colors duration-200" size={24} />
                    </button>

                    {/* send button */}
                    <button
                        className={`mb-1 ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-in-out
                        ${inputMessage.trim() ?
                                "bg-[#e7e7e7] text-[#202020] hover:bg-[#dcdcdc] hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                : "bg-[#efefef] text-[#aaaaaa] cursor-not-allowed"
                            }`}
                        disabled={!inputMessage.trim()}
                        onClick={handleSendMessage}
                    >
                        <HiArrowUp className="text-xl transition-transform duration-200" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ActiveChat;