import { Navbar } from "../components/Navbar";
import { useState } from "react";
import { Search, Send, FileText, Quote } from "lucide-react";
import { askQuestion } from "../api/ask";

export default function Ask() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showChunks, setShowChunks] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const response = await askQuestion(query);
      const result = {
        ...response,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date(),
      };
      setResults((prev) => [result, ...prev]);
      console.log(results);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setIsSearching(false);
      setQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleChunks = (resultId) => {
    setShowChunks(showChunks === resultId ? null : resultId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />

      <header className="shadow-sm z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Ask Questions</h1>
            <p className="text-gray-400 mt-1">
              Query your knowledge base with AI-powered search
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg p-6 bg-gray-900 space-y-4">
          <h2 className="text-lg font-semibold">Ask Questions</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Ask a question about your uploaded documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                className="w-full pl-10 pr-4 py-3 text-base rounded-md border bg-gray-950 border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Ask
                </>
              )}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Search Results</h3>
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border p-6 bg-gray-900 border-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-base font-medium pr-4">{result.query}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <div className="mb-6 p-4 rounded-lg border bg-slate-900 border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">AI</span>
                    </div>
                    <span className="text-sm font-medium">Answer</span>
                  </div>
                  <p className="text-sm leading-relaxed">{result.answer}</p>
                </div>

                <div className="flex flex-wrap gap-3 mb-4"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
