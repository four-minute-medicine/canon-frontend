import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";

const ChatHeader = () => {
    const router = useRouter();
    const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("Select Country");

    const handleCountryClick = (country: string) => {
        setSelectedCountry(country);
        setIsCountryMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-30 h-20 flex items-center justify-end px-6 space-x-10 bg-[#F7F7F7]">
            {/* country selector */}
            <div className="flex items-center w-fit justify-between space-x-5 px-6 py-2 text-black rounded-full bg-white"
                onClick={() =>
                    setIsCountryMenuOpen(!isCountryMenuOpen)
                }>
                <span className="text-lg font-medium">{selectedCountry}</span>
                <IoIosArrowDown className="w-4 h-4" />
            </div>

            {/* country menu */}
            {isCountryMenuOpen && (<div className="absolute top-15 right-30 max-w-2xl p-10 bg-white text-black rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-black text-center mb-8">
                    Choose Your Country
                </h1>

                <div className="flex items-center justify-between">
                    {/* left side */}
                    <div className="flex flex-col gap-6 w-1/2">
                        {/* AFRICA */}
                        <div>
                            <h2 className="text-sm font-bold text-black mb-3">AFRICA</h2>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("South Africa")
                                    }>
                                    <span>🇿🇦</span>
                                    <span>South Africa</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Nigeria")
                                    }>
                                    <span>🇳🇬</span>
                                    <span>Nigeria</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Kenya")
                                    }>
                                    <span>🇰🇪</span>
                                    <span>Kenya</span>
                                </li>
                            </ul>
                        </div>

                        {/* AUSTRALIA */}
                        <div>
                            <h2 className="text-sm font-bold text-black mb-3">AUSTRALIA</h2>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Australia")
                                    }>
                                    <span>🇦🇺</span>
                                    <span>Australia</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("New Zealand")
                                    }>
                                    <span>🇳🇿</span>
                                    <span>New Zealand</span>
                                </li>
                            </ul>
                        </div>

                        {/* NORTH AMERICA */}
                        <div>
                            <h2 className="text-sm font-bold text-black mb-3">NORTH AMERICA</h2>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Canada")
                                    }>
                                    <span>🇨🇦</span>
                                    <span>Canada</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("United States of America")
                                    }>
                                    <span>🇺🇸</span>
                                    <span>United States of America</span>
                                </li>
                            </ul>
                        </div>

                        {/* SOUTH AMERICA */}
                        <div>
                            <h2 className="text-sm font-bold text-black mb-3">SOUTH AMERICA</h2>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Brazil")
                                    }>
                                    <span>🇧🇷</span>
                                    <span>Brazil</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Mexico")
                                    }>
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
                            <ul className="flex flex-col gap-2">
                                    <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("India")
                                    }>
                                    <span>🇮🇳</span>
                                    <span>India</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Singapore")
                                    }>
                                    <span>🇸🇬</span>
                                    <span>Singapore</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Malaysia")
                                    }>
                                    <span>🇲🇾</span>
                                    <span>Malaysia</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Indonesia")
                                    }>
                                    <span>🇮🇩</span>
                                    <span>Indonesia</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Thailand")
                                    }>
                                    <span>🇹🇭</span>
                                    <span>Thailand</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Vietnam")
                                    }>
                                    <span>🇻🇳</span>
                                    <span>Vietnam</span>
                                </li>
                            </ul>
                        </div>

                        {/* EUROPE */}
                        <div>
                            <h2 className="text-sm font-bold text-black mb-3">EUROPE</h2>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("United Kingdom")
                                    }>
                                    <span>🇬🇧</span>
                                    <span>United Kingdom</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Germany")
                                    }>
                                    <span>🇩🇪</span>
                                    <span>Germany</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("France")
                                    }>
                                    <span>🇫🇷</span>
                                    <span>France</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Italy")
                                    }>
                                    <span>🇮🇹</span>
                                    <span>Italy</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Spain")
                                    }>
                                    <span>🇪🇸</span>
                                    <span>Spain</span>
                                </li>
                                <li className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600"
                                    onClick={() =>
                                        handleCountryClick("Scandinavia")
                                    }>
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
                Log In
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </span>

            {/* try it free button */}
            <button
                className="px-6 py-3 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-white font-medium transition-colors duration-200 rounded-3xl shadow-sm"
                onClick={() => router.push("/signup")}
            >
                Try it Free
            </button>
        </header>
    )
}

export default ChatHeader;