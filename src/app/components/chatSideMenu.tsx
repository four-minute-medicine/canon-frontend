
// logo
import canonLogo from '@/app/assets/the-cannon-logo.png';
import { useEffect, useState } from 'react';

// icons
import { GoSidebarCollapse } from 'react-icons/go';
import { FiHome, FiPlus } from 'react-icons/fi';
import { IoAnalyticsOutline, IoSettingsOutline, IoHomeOutline } from "react-icons/io5";
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { LuWandSparkles } from "react-icons/lu";

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
}

const ChatSideMenu = ({ isCollapsed, isMobile, isTablet, setIsCollapsed }: ChatSideMenuProps) => {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    return (
        <nav
            // className="flex flex-col w-1/5 h-full justify-between gap-5 xl:gap-1 bg-[#EDEDED] border-r border-gray-200"
            className={`flex flex-col text-white bg-[#EDEDED] h-screen ${isCollapsed ? "w-1/20" : "w-1/5"
                }
        ${isMobile && isCollapsed
                    ? "fixed top-0 left-0 z-50"
                    : isTablet && isCollapsed
                        ? "fixed top-0 left-0 z-50"
                        : "relative"
                }
        ${isMobile && !isCollapsed ? "hidden" : ""}
        `}
        >
            {/* logo & toggle button */}
            <header className={`sticky top-0 z-30 flex items-center ${isCollapsed ? "justify-center py-3" : "gap-5 px-6 py-3"
                }`}>
                {!isCollapsed && <img src={canonLogo.src} alt="Canon Logo" width={142} height={41} className="object-contain mt-2" />}
                {isCollapsed ? <GoSidebarCollapse
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
                        <NavItems icon={<FiHome className="w-6 h-6 text-black" />} label="New question" isCollapsed={isCollapsed} />
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
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 1
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 2
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 3
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 4
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 5
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 6
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 1
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 2
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 3
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 4
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 5
                        </li>
                        <li className="flex items-center px-3 py-3 rounded-lg cursor-pointer justify-start gap-2 truncate">
                            Chat 6
                        </li>
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
                                {/* <li>
                                            Questions: 10 tokens per question
                                        </li>
                                        <li>
                                            Virtual Patient Case: 100 tokens
                                        </li> */}
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
            {isCollapsed && 
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