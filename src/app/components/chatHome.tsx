import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { GrMicrophone } from "react-icons/gr";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiArrowUp } from "react-icons/hi";

interface ChatHomeProps {
    inputMessage: string;
    setInputMessage: (value: string) => void;
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
}


const ChatHome = ({ handleSendMessage, handleKeyPress, inputMessage, setInputMessage }: ChatHomeProps) => {


    return (
        <div className="flex flex-col w-full h-full items-center justify-start mt-15 p-4 text-black">

            <div className="flex flex-col items-center justify-center p-4 gap-5">
                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-8 md:mb-3 font-medium text-sm md:text-lg">
                    <span className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-[#003C6A]" size={18} style={{ color: '#0f766e' }} />
                        Tested by clinicians in beta
                    </span>
                </div>

                {/* Chat Title */}
                <div className="flex flex-col items-center justify-center gap-5 p-4 text-center">
                    <h1 className=" text-[32px] md:text-[60px] text-center leading-tight text-wrap max-w-3xl font-normal">Get Relevant Answers
                        Anywhere, Anytime
                    </h1>

                    {/* sub title */}
                    <p className="text-lg">
                        Your digital clinical reference. <br />
                        Empowering clinicians with trusted, context-aware guidance.
                    </p>
                </div>

                {/* Chat Input */}
                <div className="relative flex items-end bg-white rounded-full px-10 py-4 w-full max-w-4xl">
                    <textarea
                        placeholder="Ask Anything..."
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

            {/* disclaimer */}
            <div className="absolute bottom-0 center-0 p-4 mb-5">
                <p className="text-base italic text-center">
                    By using The Canon, an AI chatbot, you agree to our
                    <a href="https://www.fourminutemedicine.com/files/terms-and-conditions.pdf" target="_blank" className="underline"> Terms </a>
                    and <a href="https://www.fourminutemedicine.com/files/privacy-policy.pdf" target="_blank" className="underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

export default ChatHome;