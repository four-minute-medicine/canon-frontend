
// logo
import canonLogo from '@/app/assets/the-cannon-logo.png';
import { useEffect, useState } from 'react';

// icons
import { GoSidebarCollapse } from 'react-icons/go';
import { FiHome, FiPlus, FiUploadCloud } from 'react-icons/fi';
import { IoAnalyticsOutline, IoSettingsOutline, IoHomeOutline } from "react-icons/io5";
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { LuWandSparkles } from "react-icons/lu";
import { useRouter } from 'next/navigation';

const NavItems = ({ icon, label, isCollapsed }: { icon: React.ReactNode, label: string, isCollapsed: boolean }) => {
    return (
        <li className={`flex items-center px-3 py-1 rounded-lg cursor-pointer justify-center gap-2 ${isCollapsed ? "justify-center" : "justify-start"} relative group`}>
            {icon}
            {!isCollapsed && <span className={`text-black ${isCollapsed ? "hidden" : ""}`}>{label}</span>}
            {/* tooltip */}
            {isCollapsed && <span className="absolute left-25 transform -translate-x-1/2 top-0 hidden group-hover:block w-max px-4 py-4 text-sm text-[#1e1e1e] bg-gray-300 rounded-lg shadow-lg z-50">
                {label}
            </span>}
        </li>
    )
};

// Divider component
const Divider = () => (
    <hr className="border-b-gray-600 opacity-20 w-full border-b" />
);

interface ChatSideMenuProps {
    isCollapsed: boolean;
    isMobile: boolean;
    isTablet: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    chatConversations?: ChatConversation[];
    currentConversationId?: string | null;
    onNewConversation?: () => void;
    onLoadConversation?: (id: string) => void;
}

interface ChatConversation {
    id: string;
    messages: any[];
    created_at: Date;
    updated_at: Date;
}

const ChatSideMenu = ({
    isCollapsed,
    isMobile,
    isTablet,
    setIsCollapsed,
    chatConversations = [],
    currentConversationId = null,
    onNewConversation = () => { },
    onLoadConversation = () => { }
}: ChatSideMenuProps) => {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const router = useRouter();

    return (
        <nav
            className={`flex flex-col text-black bg-[#EDEDED] h-screen ${isCollapsed && !isMobile ? "w-1/20" : "w-1/5"
                }
        ${isMobile
                    ? "fixed top-0 left-0 z-50 w-2/5"
                    : isTablet
                        ? "fixed top-0 left-0 z-50"
                        : "relative"
                }
        ${isMobile && !isCollapsed ? "hidden" : ""}
        `}
        >
            {/* logo & toggle button */}
            <header className={`sticky top-0 z-30 flex items-center ${isCollapsed && !isMobile ? "justify-center py-3" : "gap-5 px-6 py-3"
                }`}>
                {!isCollapsed && <img src={canonLogo.src} alt="Canon Logo" className={`object-contain mt-2 ${isMobile ? "w-1/2" : "w-full"}`} />}
                {isCollapsed && !isMobile ? <GoSidebarCollapse
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-6 h-6 text-black mt-2"
                />
                    : <GoSidebarCollapse
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-6 h-6 text-black ml-auto rotate-180"
                    />}
            </header>

            {/* menu items */}
            <div className="flex flex-col w-full flex-1 overflow-hidden">
                <div className="flex items-start flex-col gap-4 justify-between px-4 py-2 shrink-0">
                    <ul className={`flex flex-col gap-2 items-start ${isCollapsed ? "items-center mt-5" : ""}`}>
                        <div onClick={onNewConversation}>
                            <NavItems icon={<FiHome className="w-6 h-6 text-black" />} label="New question" isCollapsed={isCollapsed && !isMobile} />
                        </div>
                        <div onClick={() => router.push('/upload')}>
                            <NavItems icon={<FiUploadCloud className="w-6 h-6 text-black" />} label="Upload Document" isCollapsed={isCollapsed} />
                        </div>
                        <NavItems icon={<IoAnalyticsOutline className="w-6 h-6 text-black" />} label="Trends" isCollapsed={isCollapsed} />
                        <NavItems icon={<IoSettingsOutline className="w-6 h-6 text-black" />} label="Settings" isCollapsed={isCollapsed} />
                    </ul>
                </div>

                {/* divider */}
                {!isCollapsed && (<div className="py-2 mx-4 shrink-0">
                    <Divider />
                </div>)}

                {/* chat history */}
                {!isCollapsed && (<div className="flex flex-col gap-2 items-start flex-1 overflow-hidden">
                    <h2 className="text-lg font-bold text-black mx-5 shrink-0">CHAT HISTORY</h2>
                    <ul className="flex flex-col gap-1 px-5 w-full mt-1 mb-2 text-black overflow-y-auto custom-scrollbar flex-1">
                        {chatConversations.length === 0 ? (
                            <li className="flex items-center px-3 py-3 text-gray-500 text-sm">
                                No chat history yet
                            </li>
                        ) : (
                            chatConversations.map((conversation) => {
                                // Get the first user message as the chat title
                                const firstUserMessage = conversation.messages.find(msg => msg.sender === 'user')
                                const title = firstUserMessage?.content?.slice(0, 30) || 'New Chat'
                                const isActive = conversation.id === currentConversationId

                                return (
                                    <li
                                        key={conversation.id}
                                        className={`flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-200 font-medium' : ''}`}
                                        onClick={() => onLoadConversation(conversation.id)}
                                        title={firstUserMessage?.content || 'New Chat'}
                                    >
                                        {title}{firstUserMessage?.content && firstUserMessage.content.length > 30 ? '...' : ''}
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </div>)}
            </div>

            {/* request a feature button */}
            {!isCollapsed && (<button className="flex items-center px-3 py-2 mx-4 rounded-lg cursor-pointer justify-between bg-white text-black shrink-0">
                <div className="flex items-center gap-1">
                    <LuWandSparkles className="w-4 h-4" />
                    <span className="font-medium">Request a feature</span>
                </div>

                <FiPlus className="w-4 h-4" />
            </button>)}

            {/* divider */}
            {!isCollapsed && <div className="py-2 mx-4 shrink-0">
                <Divider />
            </div>}

            {/* buy tokens card if not collapsed */}
            {!isCollapsed && (<div className="flex bg-white rounded-lg px-4 py-4 flex-col gap-1 mb-5 mx-4 text-black shrink-0">
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        Available tokens
                    </span>
                    <div className="relative group">
                        <FaRegCircleQuestion size={17} />
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-20 hidden group-hover:block w-max px-4 py-4 text-sm text-[#1e1e1e] bg-gray-300 rounded-lg shadow-lg z-10">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Sign-Up Bonus: 250 free tokens</li>
                                <li>
                                    100 tokens per chat
                                </li>
                            </ul>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-light rotate-45"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-end space-x-2">
                    <span className="text-3xl font-medium">
                        {100}
                    </span>
                    <span className="text-sm">
                        tokens left
                    </span>
                </div>
                <button
                    className="text-white rounded-full py-2 hover:scale-105 transition-all duration-200 bg-black"
                    onClick={() => setIsPurchaseModalOpen(true)}
                >
                    Buy More
                </button>
            </div>)}

            {/* buy token round button if collapsed -tooltip to buy tokens */}
            {isCollapsed && !isMobile &&
                (<button className="flex items-center p-2 mx-4 rounded-full cursor-pointer justify-center mb-10 bg-white text-black shrink-0 relative group">
                    <FiPlus className="w-6 h-6 hover:scale-105 transition-all duration-200" />
                    <div className="absolute left-25 transform -translate-x-1/2 top-0 hidden group-hover:block w-max px-4 py-4 text-sm text-[#1e1e1e] bg-gray-300 rounded-lg shadow-lg z-10">
                        <span>Buy Tokens</span>
                    </div>
                </button>)}
        </nav>
    )
}

export default ChatSideMenu;