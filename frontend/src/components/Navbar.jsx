import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm sticky top-0 z-50 h-16 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-100">Recaller.ai</h1>
          <p className="text-xs text-gray-400">AI Knowledge Base</p>
        </div>
      </div>
    </nav>
  );
}
