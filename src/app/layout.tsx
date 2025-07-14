// import SessionTracker from "@/components/tracker/Tracker";
import { UserProvider } from "../../context";
import "./globals.css"; // Import global styles
import { ReactNode } from "react";
import ScreenShot from "@/components/tracker/Screenshot";
import { TimerProvider } from "../../TimerContext";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "My App",
  description: "A basic Next.js app",
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        {" "}
        <UserProvider>
          <TimerProvider>
            <ScreenShot />
            {/* <SessionTracker /> */}
            <div id="main-content">{children}</div>
          </TimerProvider>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
