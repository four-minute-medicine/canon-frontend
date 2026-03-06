import { useEffect, useState } from 'react';
import ChatSideMenu from './chatSideMenu';
import ChatHeader from './chatHeader';
import ChatHome from './chatHome';



const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const useMediaQuery = (query: string): boolean => {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            if (typeof window === "undefined" || !window.matchMedia) {
                return;
            }
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            media.addEventListener
                ? media.addEventListener("change", listener)
                : media.addListener(listener);
            return () =>
                media.removeEventListener
                    ? media.removeEventListener("change", listener)
                    : media.removeListener(listener);
        }, [matches, query]);

        return matches;
    };

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1024px)");

    return (
        <div className="flex h-screen overflow-hidden bg-[#FBFBFB]">
           {/* sidebar */}
           <ChatSideMenu 
            isCollapsed={isCollapsed} 
            isMobile={isMobile} 
            isTablet={isTablet} 
            setIsCollapsed={setIsCollapsed} />

           {/* main content */}
           <div className={`flex flex-col 
            ${(isCollapsed && !isMobile) ? "w-19/20" : isMobile ? "w-full" : "w-4/5"} bg-white border-r border-gray-200`}>
           {/* header */}
           <ChatHeader isMobile={isMobile} isTablet={isTablet} />


            {/* chat container */}
            <main className="flex flex-col w-full h-full bg-[#F7F7F7]">
                {children}
            </main>
           </div>
        </div>
    )
}

export default ChatLayout;