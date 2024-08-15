'use client';
import React from "react";

const WebHomePageMenuBar = () => {
  return (
    <nav className="bg-white text-menuBarText text-base p-3 flex items-center justify-between shadow relative">
      <div className="flex flex-col">
        <div className="font-bold text-lg text-accent flex items-center">
          <img src="/images/webHomePage_telephon_icon.png" alt="Telephone" className="mr-2 w-5" />
          0120-777-777
        </div>
        <div className="text-sm text-secondary">
          受付時間: 10時~17時（平日） | 定休日: 土･日･祝日
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <a href="#services" className="group relative text-menuBarText hover:text-primary flex items-center">
          <img src="/images/webHomePage_services_icon.png" alt="Services" className="mr-1 w-5" />
          サービス
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </a>
        <a href="#pricing" className="group relative text-menuBarText hover:text-primary flex items-center">
          <img src="/images/webHomePage_pricing_icon.png" alt="Services" className="mr-1 w-5" />
          利用料金
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </a>
        <a href="#access" className="group relative text-menuBarText hover:text-primary flex items-center">
          <img src="/images/webHomePage_access_icon.png" alt="Access" className="mr-1 w-5" />
          アクセス
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </a>
        <a href="#companyInfo" className="group relative text-menuBarText hover:text-primary flex items-center">
          <img src="/images/webHomePage_companyInfo_icon.png" alt="Company Info" className="mr-1 w-5" />
          会社概要
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </a>
        <a href="/webHomePage/contact" className="group relative text-menuBarText hover:text-primary flex items-center">
          <img src="/images/webHomePage_contact_icon.png" alt="Contact" className="mr-1 w-5" />
          <span className="font-bold text-accent">問合せ/利用申込</span>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </a>
      </div>
    </nav>
  );
};

export default WebHomePageMenuBar;
