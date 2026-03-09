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
}

const ActiveChat = ({ messages, isResponding = false, handleSendMessage, handleKeyPress, inputMessage, setInputMessage, isMobile }: ActiveChatProps) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isResponding]);

    return (
        <div className="flex min-h-0 flex-1 flex-col border-t border-teal-light">
            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:px-6 lg:px-10">
                {messages.map((msg) => {
                    const isUser = msg.sender !== "bot";
                    const introMessage = msg.id === "1" && !isUser ? true : false;

                    if (isUser) {
                        return (
                            <div
                                key={msg.id}
                                className="flex items-start gap-2">
                                {/* message container */}
                                <div
                                    className="flex w-full justify-start"
                                >
                                    <div
                                        className={`max-w-[92%] rounded-2xl px-1 py-2 sm:max-w-[80%] ${isUser
                                            ? " text-black justify-end"
                                            : introMessage ? " text-black justify-start" : "text-black justify-start"
                                            }`}
                                    >
                                        <div className="leading-relaxed whitespace-pre-wrap wrap-break-word">
                                            {msg.message}
                                        </div>

                                        {/* timestamp */}
                                        <div className="text-xs text-[#717182] mb-1">
                                        {isUser ? "You" : ""}{" "}
                                        {/* {new Date(msg.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })} */}
                                    </div>
                                    </div>
                                </div>


                            </div>

                        );
                    } else if (introMessage) {
                        return (
                            <div
                                key={msg.id}
                                className="flex items-start gap-2">

                                {/* message container */}
                                <div
                                    className="flex w-full justify-start"
                                >
                                    <div
                                        className="max-w-[92%] rounded-2xl px-1 py-2 text-black justify-start sm:max-w-[80%]"
                                    >
                                        <div className="leading-relaxed whitespace-pre-wrap wrap-break-word">
                                            {msg.message}
                                        </div>

                                        {/* timestamp */}
                                        {/* <div className="text-xs text-[#717182] mb-1">
                                        {isUser ? "You" : ""}{" "}
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
                                    </div> */}
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
                        <div className="max-w-[75%] rounded-2xl px-4 py-3 text-[#1E1E1E] sm:max-w-[60%]">
                            <div className="text-xs text-[#717182] mb-1">Canon · thinking…</div>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Chat Input */}
            <div className="sticky bottom-0 border-t border-black/5 bg-[#F7F7F7]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
                <div className="mx-auto flex w-full max-w-4xl items-end gap-2 rounded-[28px] bg-white px-4 py-3 shadow-sm sm:gap-3 sm:px-6 sm:py-4">
                    <textarea
                        placeholder={isResponding ? "Thinking..." : "Ask Anything..."}
                        className="custom-scrollbar min-h-[40px] max-h-[140px] w-full resize-none border-none bg-transparent py-2 leading-6 text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0"
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
                        className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                        disabled={isResponding}
                    >
                        <GrMicrophone className="text-gray-600" size={24} />
                    </button>

                    {/* send button */}
                    <button
                        className={`mb-1 ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors
                        ${inputMessage.trim() ?
                                "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-300 text-white cursor-not-allowed"
                            }`}
                        disabled={!inputMessage.trim()}
                        onClick={handleSendMessage}
                    >
                        <HiArrowUp className="text-xl" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ActiveChat;