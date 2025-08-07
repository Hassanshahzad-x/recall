import { Layout } from "../components/Layout";
import { Clock, MessageSquare, FileText } from "lucide-react";

const mockHistory = [
  {
    id: "1",
    question: "What are the key findings from the quarterly report?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    sources: ["Q4_Report.pdf", "Summary.docx"],
    chunks: 5,
  },
  {
    id: "2",
    question: "How does the new product strategy compare to last year?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    sources: ["Strategy_2024.pdf", "Product_Roadmap.docx"],
    chunks: 8,
  },
  {
    id: "3",
    question: "What are the main risks identified in the risk assessment?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    sources: ["Risk_Assessment.pdf"],
    chunks: 3,
  },
];

export default function History() {
    const formatTimestamp = (date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        return `${diffDays} days ago`;
      }
    };
  
  return (
    <Layout
      title="Search History"
      description="Review your previous questions and answers"
    >
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {mockHistory.length > 0 ? (
            <div className="space-y-6">
              {mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 max-w-md">
                      {item.question}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>
                          {item.sources.length} source
                          {item.sources.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          {item.chunks} chunk{item.chunks !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.sources.map((source, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-inner">
              <Clock className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No search history yet
              </h3>
              <p className="text-gray-500">
                Your previous questions and answers will appear here once you
                start using the search.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
