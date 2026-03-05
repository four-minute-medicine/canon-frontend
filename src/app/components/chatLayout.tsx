import ChatSideMenu from './chatSideMenu';
import ChatHeader from './chatHeader';
import ChatHome from './chatHome';


const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#FBFBFB]">
           {/* sidebar */}
           <ChatSideMenu />

           {/* main content */}
           <div className="flex flex-col w-4/5 bg-white border-r border-gray-200">
           {/* header */}
           <ChatHeader />


            {/* chat container */}
            <main className="flex flex-col w-full h-full bg-[#F7F7F7]">
                {children}
            </main>
           </div>
        </div>
    )
}

export default ChatLayout;