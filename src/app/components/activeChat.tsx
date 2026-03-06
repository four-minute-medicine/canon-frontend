import { useRef, useState } from "react";
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
        args: any;
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
    // console.log("messages", messages);
    const endRef = useRef<HTMLDivElement>(null);


    return (
        <div className="flex flex-col items-center justify-start mt-10 md:h-full h-[55vh] border-t border-teal-light p-4">
            <div className="w-full space-y-8 overflow-y-auto md:max-h-[75vh] max-h-[55vh] px-10 custom-scrollbar">
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
                                    className="flex w-full justify-start ml-4"
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
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
                                    className={`flex w-full ${isUser ? "justify-end -ml-10" : "justify-start mr-20"}`}
                                >
                                    <div
                                        className="max-w-[80%] rounded-2xl px-4 py-3 text-black justify-start"
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
                        <div className="max-w-[60%] rounded-2xl px-4 py-3 text-[#1E1E1E]">
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
            <div className="absolute bottom-0 left-80 right-0 bg-[#F7F7F7] py-6 px-4 flex justify-center">
                <div className="flex items-end bg-white rounded-full px-10 py-4 w-full max-w-4xl">
                    <textarea
                        placeholder={isResponding ? "Thinking..." : "Ask Anything..."}
                        className="w-full bg-transparent text-gray-700 placeholder-gray-400 resize-none outline-none border-none focus:ring-0 min-h-[40px] max-h-[120px] leading-6 py-2 custom-scrollbar"
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
                        className="flex items-center justify-center h-10 w-10 rounded-full transition-colors hover:bg-gray-100 shrink-0 mb-2"
                        disabled={isResponding}
                    >
                        <GrMicrophone className="text-gray-600" size={24} />
                    </button>

                    {/* send button */}
                    <button
                        className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors shrink-0 ml-1 mb-2
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