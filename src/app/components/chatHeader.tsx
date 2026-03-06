import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";

interface ChatHeaderProps {
    isMobile: boolean;
    isTablet: boolean;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

const ChatHeader = ({ isMobile, isTablet, isCollapsed, setIsCollapsed }: ChatHeaderProps) => {
    const router = useRouter();
    const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(isMobile ? "Country" : "Select Country");

    const handleCountryClick = (country: string) => {
        setSelectedCountry(country);
        setIsCountryMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-6 space-x-10 bg-[#F7F7F7]">

            {/* mobile menu button */}
            <button className="md:hidden" onClick={() => setIsCollapsed(!isCollapsed)}>
                <GoSidebarCollapse className="w-6 h-6 text-black" />
            </button>

            {/* desktop menu button */}
            <button className="hidden md:block">
                <GoSidebarCollapse className="w-6 h-6 text-[#F7F7F7]" />
            </button>

            {/* left side */}
            <div className="flex items-center justify-end gap-10">
                {/* country selector */}
                <div className="flex items-center w-fit justify-between space-x-5 px-6 py-2 text-black rounded-full bg-white"
                    onClick={() =>
                        setIsCountryMenuOpen(!isCountryMenuOpen)
                    }>
                    <span className="text-lg font-medium">{selectedCountry}</span>
                    <IoIosArrowDown className="w-4 h-4" />
                </div>

                {/* country menu */}
                {isCountryMenuOpen && (
                    <div className="absolute top-15 sm:center-0 max-w-3xl p-10 flex flex-col bg-white text-black rounded-lg shadow-md">
                        <h1 className="text-3xl font-semibold text-black text-center mb-8">
                            Choose Your Country
                        </h1>

                        <div className="flex sm:flex-row h-[60vh] sm:h-auto flex-col items-center justify-center overflow-y-auto custom-scrollbar">
                            {/* left side */}
                            <div className="flex flex-col gap-6 w-1/2">
                                {/* AFRICA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">AFRICA</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "ZA" : "South Africa";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇿🇦</span>
                                            <span>South Africa</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "NG" : "Nigeria";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇳🇬</span>
                                            <span>Nigeria</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "KE" : "Kenya";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇰🇪</span>
                                            <span>Kenya</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* AUSTRALIA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">AUSTRALIA</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "AUS" : "Australia";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇦🇺</span>
                                            <span>Australia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "NZ" : "New Zealand";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇳🇿</span>
                                            <span>New Zealand</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* NORTH AMERICA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">NORTH AMERICA</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "CAN" : "Canada";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇨🇦</span>
                                            <span>Canada</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "USA" : "United States of America";
                                                handleCountryClick(country);
                                            }
                                            }>
                                            <span>🇺🇸</span>
                                            <span>United States of America</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* SOUTH AMERICA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">SOUTH AMERICA</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "BR" : "Brazil";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇧🇷</span>
                                            <span>Brazil</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "MX" : "Mexico";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇲🇽</span>
                                            <span>Mexico</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* right side */}
                            <div className="flex flex-col gap-6 w-1/2">
                                {/* ASIA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">ASIA</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "IN" : "India";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇮🇳</span>
                                            <span>India</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "SG" : "Singapore";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇸🇬</span>
                                            <span>Singapore</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "MY" : "Malaysia";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇲🇾</span>
                                            <span>Malaysia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "ID" : "Indonesia";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇮🇩</span>
                                            <span>Indonesia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "TH" : "Thailand";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇹🇭</span>
                                            <span>Thailand</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "VN" : "Vietnam";
                                                    handleCountryClick(country);
                                            }}>
                                            <span>🇻🇳</span>
                                            <span>Vietnam</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* EUROPE */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">EUROPE</h2>
                                    <ul className="flex flex-col gap-2 sm:w-100 w-full">
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "UK" : "United Kingdom";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇬🇧</span>
                                            <span>United Kingdom</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "DE" : "Germany";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇩🇪</span>
                                            <span>Germany</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "FR" : "France";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇫🇷</span>
                                            <span>France</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "IT" : "Italy";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇮🇹</span>
                                            <span>Italy</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "ES" : "Spain";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇪🇸</span>
                                            <span>Spain</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                const country = isMobile ? "SE" : "Scandinavia";
                                                handleCountryClick(country);
                                            }}>
                                            <span>🇸🇪</span>
                                            <span>Scandinavia</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>)}


                {/* login button */}
                <span
                    className="cursor-pointer text-lg font-medium relative group text-black"
                    onClick={() => router.push("/login")}
                >
                    {isMobile ? "Login" : "Log In"}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>

                {/* try it free button */}
                <button
                    className={`px-6 py-3 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-white font-medium transition-colors duration-200 rounded-3xl shadow-sm ${isMobile ? "text-sm px-1 py-2" : ""}`}
                    onClick={() => router.push("/signup")}
                >
                    {isMobile ? "Try it" : "Try it Free"}
                </button>
            </div>

        </header>
    )
}

export default ChatHeader;