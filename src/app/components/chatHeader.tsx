import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { FiUser } from "react-icons/fi";

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
    isAuthenticated?: boolean;
}

const ChatHeader = ({ isMobile, isTablet, isCollapsed, setIsCollapsed, onCountryChange, isAuthenticated = false }: ChatHeaderProps) => {
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
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-black/5 bg-[#F7F7F7] px-4 sm:px-6">

            {/* mobile menu button */}
            <button className={`${isTablet ? "inline-flex" : "invisible"} shrink-0`} onClick={() => setIsCollapsed(!isCollapsed)}>
                <GoSidebarCollapse className="w-6 h-6 text-black" />
            </button>

            {/* left side */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 lg:gap-6">
                {/* country selector */}
                <button
                    type="button"
                    className="flex min-w-0 max-w-[180px] items-center justify-between gap-3 rounded-full bg-white px-4 py-2 text-black sm:max-w-none sm:px-6"
                    onClick={() =>
                        setIsCountryMenuOpen(!isCountryMenuOpen)
                    }>
                    <span className="truncate text-sm font-medium sm:text-base">{displayLabel}</span>
                    <IoIosArrowDown className="w-4 h-4" />
                </button>

                {/* country menu */}
                {isCountryMenuOpen && (
                    <div className="absolute inset-x-4 top-full mt-3 max-h-[75vh] overflow-hidden rounded-2xl bg-white p-5 text-black shadow-md sm:left-auto sm:right-6 sm:w-[min(90vw,760px)] sm:p-8">
                        <h1 className="mb-6 text-center text-2xl font-semibold text-black sm:mb-8 sm:text-3xl">
                            Choose Your Country
                        </h1>

                        <div className="custom-scrollbar flex h-[55vh] flex-col justify-start gap-6 overflow-y-auto sm:h-auto sm:flex-row sm:items-start sm:justify-center">
                            {/* left side */}
                            <div className="flex w-full flex-col gap-6 sm:w-1/2">
                                {/* AFRICA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">AFRICA</h2>
                                    <ul className="flex w-full flex-col gap-2">
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
                                    <ul className="flex w-full flex-col gap-2">
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
                                    <ul className="flex w-full flex-col gap-2">
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
                                    <ul className="flex w-full flex-col gap-2">
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
                            <div className="flex w-full flex-col gap-6 sm:w-1/2">
                                {/* ASIA */}
                                <div>
                                    <h2 className="text-sm font-bold text-black mb-3">ASIA</h2>
                                    <ul className="flex w-full flex-col gap-2">
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
                                    <ul className="flex w-full flex-col gap-2">
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


                {isAuthenticated ? (
                    <button
                        type="button"
                        aria-label="Account"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm"
                    >
                        <FiUser className="h-5 w-5" />
                    </button>
                ) : (
                    <>
                        {/* login button */}
                        <span
                            className="relative hidden cursor-pointer text-sm font-medium text-black group sm:inline-block sm:text-base"
                            onClick={() => router.push("/login")}
                        >
                            {isMobile ? "Login" : "Log In"}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                        </span>

                        {/* try it free button */}
                        <button
                            className="rounded-3xl bg-[#1e1e1e] px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#2d2d2d] sm:px-5 sm:py-3"
                            onClick={() => router.push("/signup")}
                        >
                            {isMobile ? "Try it" : "Try it Free"}
                        </button>
                    </>
                )}
            </div>

        </header>
    )
}

export default ChatHeader;