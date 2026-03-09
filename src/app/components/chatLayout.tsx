import { useEffect, useState } from 'react';
import ChatSideMenu from './chatSideMenu';
import ChatHeader from './chatHeader';

interface ChatConversation {
    id: string;
    messages: Array<{ sender?: string; content?: string }>;
    created_at: Date;
    updated_at: Date;
}

interface ChatLayoutProps {
    children: React.ReactNode;
    chatConversations?: ChatConversation[];
    currentConversationId?: string | null;
    onNewConversation?: () => void;
    onLoadConversation?: (id: string) => void;
    onCountryChange?: (isoCode: string) => void;
}

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) {
            return;
        }

        const media = window.matchMedia(query);
        const updateMatches = () => setMatches(media.matches);

        updateMatches();

        if (media.addEventListener) {
            media.addEventListener("change", updateMatches);
        } else {
            media.addListener(updateMatches);
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", updateMatches);
            } else {
                media.removeListener(updateMatches);
            }
        };
    }, [query]);

    return matches;
};

const ChatLayout = ({
    children,
    chatConversations = [],
    currentConversationId = null,
    onNewConversation = () => { },
    onLoadConversation = () => { },
    onCountryChange
}: ChatLayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

    return (
        <div className="flex h-screen overflow-hidden bg-[#FBFBFB]">
            {/* sidebar */}
            <ChatSideMenu
                isCollapsed={isCollapsed}
                isTablet={isTablet}
                setIsCollapsed={setIsCollapsed}
                chatConversations={chatConversations}
                currentConversationId={currentConversationId}
                onNewConversation={onNewConversation}
                onLoadConversation={onLoadConversation}
            />

            {/* main content */}
            <div className="relative flex min-w-0 flex-1 flex-col bg-white border-r border-gray-200">
                {/* header */}
                <ChatHeader isMobile={isMobile} isTablet={isTablet} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onCountryChange={onCountryChange} />


                {/* chat container */}
                <main className="flex min-h-0 flex-1 flex-col bg-[#F7F7F7]">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default ChatLayout;