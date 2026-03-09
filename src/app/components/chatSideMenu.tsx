// logo
import canonLogo from '@/app/assets/the-cannon-logo.png';
import { useState } from 'react';

// icons
import { GoSidebarCollapse } from 'react-icons/go';
import { FiHome, FiPlus, FiUploadCloud } from 'react-icons/fi';
import { IoAnalyticsOutline, IoSettingsOutline } from "react-icons/io5";
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { LuWandSparkles } from "react-icons/lu";
import { useRouter } from 'next/navigation';

const NavItems = ({ icon, label, isCollapsed }: { icon: React.ReactNode, label: string, isCollapsed: boolean }) => {
    return (
        <li className={`relative flex w-full items-center gap-2 rounded-lg px-3 py-2 cursor-pointer ${isCollapsed ? "justify-center" : "justify-start"} group`}>
            {icon}
            {!isCollapsed && <span className="text-black">{label}</span>}
            {/* tooltip */}
            {isCollapsed && <span className="absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-300 px-4 py-2 text-sm text-[#1e1e1e] shadow-lg group-hover:block">
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
    isTablet: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    chatConversations?: ChatConversation[];
    currentConversationId?: string | null;
    onNewConversation?: () => void;
    onLoadConversation?: (id: string) => void;
}

interface ChatConversation {
    id: string;
    messages: Array<{ sender?: string; content?: string }>;
    created_at: Date;
    updated_at: Date;
}

const ChatSideMenu = ({
    isCollapsed,
    isTablet,
    setIsCollapsed,
    chatConversations = [],
    currentConversationId = null,
    onNewConversation = () => { },
    onLoadConversation = () => { }
}: ChatSideMenuProps) => {
    const [, setIsPurchaseModalOpen] = useState(false);
    const router = useRouter();
    const showOverlayMenu = isTablet && isCollapsed;
    const isDesktopCollapsed = !isTablet && isCollapsed;

    return (
        <>
            {showOverlayMenu && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => setIsCollapsed(false)}
                />
            )}

            <nav
                className={`z-50 flex h-screen flex-col bg-[#EDEDED] text-black transition-transform duration-300 ease-out ${isTablet
                    ? `fixed top-0 left-0 w-[85vw] max-w-[320px] ${isCollapsed ? "translate-x-0" : "-translate-x-full"}`
                    : `relative shrink-0 ${isDesktopCollapsed ? "w-[88px]" : "w-[320px]"}`
                    }`}
            >
            {/* logo & toggle button */}
            <header className={`sticky top-0 z-30 flex items-center bg-[#EDEDED] ${isDesktopCollapsed ? "justify-center px-2 py-4" : "gap-4 px-4 py-4 sm:px-6"}`}>
                {!isDesktopCollapsed && <img src={canonLogo.src} alt="Canon Logo" className="mt-1 h-auto w-32 object-contain sm:w-40" />}
                {isDesktopCollapsed ? <GoSidebarCollapse
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-6 h-6 text-black mt-2"
                />
                    : <GoSidebarCollapse
                        onClick={() => setIsCollapsed(isTablet ? false : !isCollapsed)}
                        className={`ml-auto h-6 w-6 text-black ${isTablet ? "" : "rotate-180"}`}
                    />}
            </header>

            {/* menu items */}
            <div className="flex flex-col w-full flex-1 overflow-hidden">
                <div className="flex shrink-0 flex-col items-start justify-between gap-4 px-3 py-2 sm:px-4">
                    <ul className={`flex w-full flex-col gap-2 ${isDesktopCollapsed ? "items-center mt-4" : ""}`}>
                        <div className="w-full" onClick={onNewConversation}>
                            <NavItems icon={<FiHome className="w-6 h-6 text-black" />} label="New question" isCollapsed={isDesktopCollapsed} />
                        </div>
                        <div className="w-full" onClick={() => router.push('/upload')}>
                            <NavItems icon={<FiUploadCloud className="w-6 h-6 text-black" />} label="Upload Document" isCollapsed={isDesktopCollapsed} />
                        </div>
                        <NavItems icon={<IoAnalyticsOutline className="w-6 h-6 text-black" />} label="Trends" isCollapsed={isDesktopCollapsed} />
                        <NavItems icon={<IoSettingsOutline className="w-6 h-6 text-black" />} label="Settings" isCollapsed={isDesktopCollapsed} />
                    </ul>
                </div>

                {/* divider */}
                {!isDesktopCollapsed && (<div className="mx-4 shrink-0 py-2">
                    <Divider />
                </div>)}

                {/* chat history */}
                {!isDesktopCollapsed && (<div className="flex flex-1 flex-col items-start gap-2 overflow-hidden">
                    <h2 className="mx-5 shrink-0 text-sm font-bold tracking-wide text-black sm:text-base">CHAT HISTORY</h2>
                    <ul className="custom-scrollbar mt-1 mb-2 flex w-full flex-1 flex-col gap-1 overflow-y-auto px-4 text-black sm:px-5">
                        {chatConversations.length === 0 ? (
                            <li className="flex items-center px-3 py-3 text-sm text-gray-500">
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
                                        className={`flex items-center justify-start gap-2 truncate rounded-lg px-3 py-3 cursor-pointer transition-colors hover:bg-gray-200 ${isActive ? 'bg-gray-200 font-medium' : ''}`}
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
            {!isDesktopCollapsed && (<button className="mx-4 flex shrink-0 items-center justify-between rounded-lg bg-white px-3 py-2 text-black cursor-pointer">
                <div className="flex items-center gap-1">
                    <LuWandSparkles className="w-4 h-4" />
                    <span className="font-medium">Request a feature</span>
                </div>

                <FiPlus className="w-4 h-4" />
            </button>)}

            {/* divider */}
            {!isDesktopCollapsed && <div className="mx-4 shrink-0 py-2">
                <Divider />
            </div>}

            {/* buy tokens card if not collapsed */}
            {!isDesktopCollapsed && (<div className="mx-4 mb-5 flex shrink-0 flex-col gap-1 rounded-lg bg-white px-4 py-4 text-black">
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
            {isDesktopCollapsed &&
                (<button className="relative mx-4 mb-10 flex shrink-0 items-center justify-center rounded-full bg-white p-2 text-black cursor-pointer group">
                    <FiPlus className="w-6 h-6 hover:scale-105 transition-all duration-200" />
                    <div className="absolute left-full top-1/2 z-10 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-300 px-4 py-2 text-sm text-[#1e1e1e] shadow-lg group-hover:block">
                        <span>Buy Tokens</span>
                    </div>
                </button>)}
            </nav>
        </>
    )
}

export default ChatSideMenu;