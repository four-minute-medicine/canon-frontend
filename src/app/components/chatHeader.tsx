import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";

const COUNTRY_MAP: Record<string, string> = {
    ZA: "South Africa",
    NG: "Nigeria",
    KE: "Kenya",
    AU: "Australia",
    NZ: "New Zealand",
    CA: "Canada",
    US: "United States of America",
    BR: "Brazil",
    MX: "Mexico",
    IN: "India",
    SG: "Singapore",
    MY: "Malaysia",
    ID: "Indonesia",
    TH: "Thailand",
    VN: "Vietnam",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    SE: "Scandinavia",
}

interface ChatHeaderProps {
    isMobile: boolean;
    isTablet: boolean;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    onCountryChange?: (isoCode: string) => void;
}

const ChatHeader = ({ isMobile, isTablet, isCollapsed, setIsCollapsed, onCountryChange }: ChatHeaderProps) => {
    const router = useRouter();
    const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState("");

    const displayLabel = selectedCountryCode
        ? (isMobile ? selectedCountryCode : COUNTRY_MAP[selectedCountryCode] || selectedCountryCode)
        : (isMobile ? "Country" : "Select Country");

    const handleCountryClick = (isoCode: string) => {
        setSelectedCountryCode(isoCode);
        setIsCountryMenuOpen(false);
        onCountryChange?.(isoCode);
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
                    <span className="text-lg font-medium">{displayLabel}</span>
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
                                            onClick={() => handleCountryClick("ZA")}>
                                            <span>🇿🇦</span>
                                            <span>South Africa</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("NG")}>
                                            <span>🇳🇬</span>
                                            <span>Nigeria</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("KE")}>
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
                                            onClick={() => handleCountryClick("AU")}>
                                            <span>🇦🇺</span>
                                            <span>Australia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("NZ")}>
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
                                            onClick={() => handleCountryClick("CA")}>
                                            <span>🇨🇦</span>
                                            <span>Canada</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("US")}>
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
                                            onClick={() => handleCountryClick("BR")}>
                                            <span>🇧🇷</span>
                                            <span>Brazil</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("MX")}>
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
                                            onClick={() => handleCountryClick("IN")}>
                                            <span>🇮🇳</span>
                                            <span>India</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("SG")}>
                                            <span>🇸🇬</span>
                                            <span>Singapore</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("MY")}>
                                            <span>🇲🇾</span>
                                            <span>Malaysia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("ID")}>
                                            <span>🇮🇩</span>
                                            <span>Indonesia</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("TH")}>
                                            <span>🇹🇭</span>
                                            <span>Thailand</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("VN")}>
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
                                            onClick={() => handleCountryClick("GB")}>
                                            <span>🇬🇧</span>
                                            <span>United Kingdom</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("DE")}>
                                            <span>🇩🇪</span>
                                            <span>Germany</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("FR")}>
                                            <span>🇫🇷</span>
                                            <span>France</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("IT")}>
                                            <span>🇮🇹</span>
                                            <span>Italy</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("ES")}>
                                            <span>🇪🇸</span>
                                            <span>Spain</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                            onClick={() => handleCountryClick("SE")}>
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