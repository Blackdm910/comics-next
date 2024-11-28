'use client'
import { useState, useEffect, useMemo } from "react";
import KomikIndo from "./komik/komikindo/page";
import Komiku from "./komik/komiku/page"; // Perbaikan impor dengan nama yang benar

export default function Home() {
  const [activeTab, setActiveTab] = useState("komikindo");
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Cache tab untuk menyimpan komponen yang sudah dirender
  const [tabCache, setTabCache] = useState({
    komikindo: <KomikIndo />,
    komiku: <Komiku />, // Nama konsisten
    tab3: null,
  });

  // Data tab: nama dan komponen terkait
  const tabs = useMemo(
    () => [
      { name: "KomikIndo", route: "komikindo", component: <KomikIndo /> },
      { name: "Komiku", route: "komiku", component: <Komiku /> }, // Nama konsisten
      { name: "Tab 3", route: "tab3", component: <div>Ini adalah konten Tab 3</div> },
    ],
    []
  );

  // Handle visibility of tab bar during scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsTabVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Load tab baru hanya jika belum ada di cache
  useEffect(() => {
    const activeTabData = tabs.find((tab) => tab.route === activeTab);
    if (activeTabData && !tabCache[activeTab]) {
      setTabCache((prev) => ({ ...prev, [activeTab]: activeTabData.component }));
    }
  }, [activeTab, tabCache, tabs]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render konten tab aktif dari cache */}
      <div className="flex-grow">{tabCache[activeTab]}</div>

      {/* Tab navigasi */}
      <div
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ${
          isTabVisible ? "translate-y-0" : "translate-y-full"
        } bg-white shadow-t border-t border-gray-700`}
      >
        <div className="flex justify-around items-center h-10 bg-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.route}
              className={`flex-1 text-center py-2 ${
                activeTab === tab.route ? "text-blue-500 font-bold" : "text-white-500"
              }`}
              onClick={() => setActiveTab(tab.route)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}