import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children, title, description }) {
return (
  <div className="min-h-screen bg-gray-950 text-white">
    <Navbar />

    {/* Header */}
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

}
