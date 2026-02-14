import React from "react";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
     
      <main>{children}</main>
    </div>
  );
}