import React from "react";

const Header = () => {
  return (
    <header className="bg-header text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="/images/logo_transparent.png"
          alt="CareBridge"
          className="h-8"
        />
      </div>
    </header>
  );
};

export default Header;
