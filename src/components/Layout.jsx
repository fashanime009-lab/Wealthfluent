import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "./consent/CookieConsent";
import SiteGuideLauncher from "./guide/SiteGuideLauncher";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoading from "./PageLoading";

export default function Layout() {
  return (
    <>
      <Navbar />

      {/* bg-white here is a safety net, not a visual change: pages that
          already set their own background (bg-[#f3f7fc], bg-slate-50,
          etc.) simply paint over it. Pages that DON'T set one — several
          across the site — would otherwise inherit body's fixed light
          background while their own text colors get brightened by the
          dark-mode overrides in index.css, producing invisible
          light-on-light text. Because bg-white is one of the classes
          those overrides already handle, giving every page this shared
          fallback keeps its background and text flipping together. */}
      <main className="bg-white">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CookieConsent />
      <SiteGuideLauncher />
    </>
  );
}