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
        <div className="flex h-full w-full flex-col items-center justify-between px-4 pb-6 pt-8 text-black sm:px-6 lg:px-8">
            <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-6 sm:gap-8">
                {/* Trust Indicators */}
                <div className="mb-2 flex flex-col items-center justify-center gap-2 text-center text-sm font-medium sm:flex-row sm:gap-3 sm:text-base md:mb-1 md:text-lg">
                    <span className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-[#003C6A]" size={18} style={{ color: '#0f766e' }} />
                        Tested by clinicians in beta
                    </span>
                </div>

                {/* Chat Title */}
                <div className="flex flex-col items-center justify-center gap-4 px-2 text-center sm:gap-5 sm:p-4">
                    <h1 className="max-w-3xl text-center text-[34px] leading-tight font-normal text-balance sm:text-[42px] md:text-[56px]">Get Relevant Answers
                        Anywhere, Anytime
                    </h1>

                    {/* sub title */}
                    <p className="max-w-2xl text-base leading-relaxed sm:text-lg">
                        Your digital clinical reference. <br />
                        Empowering clinicians with trusted, context-aware guidance.
                    </p>
                </div>

                {/* Chat Input */}
                <div className="relative flex w-full max-w-4xl items-end gap-2 rounded-[28px] bg-white px-4 py-3 shadow-sm sm:gap-3 sm:px-6 sm:py-4">
                    <textarea
                        placeholder="Ask Anything..."
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

            {/* disclaimer */}
            <div className="w-full max-w-4xl px-2 pt-4">
                <p className="text-center text-sm italic sm:text-base">
                    By using The Canon, an AI chatbot, you agree to our
                    <a href="https://www.fourminutemedicine.com/files/terms-and-conditions.pdf" target="_blank" className="underline"> Terms </a>
                    and <a href="https://www.fourminutemedicine.com/files/privacy-policy.pdf" target="_blank" className="underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

export default ChatHome;