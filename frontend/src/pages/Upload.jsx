import { Navbar } from "../components/Navbar";
import { useState, useRef, useEffect, useCallback } from "react";
import { Upload as UploadFile, X, Search, Send } from "lucide-react";
import { uploadFileToServer } from "../api/upload";
import { askQuestion } from "../api/ask";
import { removeFileFromServer, refreshFiles } from "../api/remove";

export default function UploadAndAsk() {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filesRef = useRef(files);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleFileUpload = useCallback((fileList) => {
    const validTypes = [".pdf", ".docx", ".txt"];
    const newFiles = [];
    const formData = new FormData();

    Array.from(fileList).forEach((file) => {
      const fileExtension = file.name
        .toLowerCase()
        .slice(file.name.lastIndexOf("."));
      if (!validTypes.includes(fileExtension)) return;

      const id = Math.random().toString(36).substr(2, 9);
      const uploadedFile = {
        id,
        filename: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        chunks: 0,
        file,
      };

      formData.append("files", file);
      newFiles.push(uploadedFile);
    });

    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: 100, status: "complete" } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
          );
        }
      }, 300);
    });

    uploadFileToServer(formData)
      .then((data) => {
        setFiles((prev) =>
          prev.map((f) => {
            const matched = data.files?.find((d) => d.filename == f.filename);
            return matched
              ? {
                  ...f,
                  status: "complete",
                  chunks: matched.chunks,
                  progress: 100,
                }
              : f;
          })
        );
      })
      .catch((err) => {
        console.error("Bulk upload failed:", err.message);
        setFiles((prev) =>
          prev.map((f) =>
            newFiles.some((nf) => nf.id === f.id)
              ? { ...f, status: "error", progress: 100 }
              : f
          )
        );
      });
  }, []);

  const removeFile = (fileId, filename) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFile === fileId) setSelectedFile(null);
    removeFileFromServer(filename);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <div className="flex flex-1">
        {/* Upload Section */}
        <div className="w-1/2 p-6 border-r border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <div
            className={`border-2 border-dashed p-6 rounded-lg cursor-pointer text-center ${
              isDragOver
                ? "border-blue-400 bg-blue-950"
                : "border-gray-700 hover:border-blue-400 hover:bg-gray-800"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <UploadFile className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm">Drop files here or click to upload</p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`p-3 rounded border ${
                    selectedFile === file.id
                      ? "border-blue-400 bg-blue-950"
                      : "border-gray-700 hover:border-blue-400 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm truncate">{file.filename}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                    <button
                      onClick={() => removeFile(file.id, file.filename)}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ask Section */}
        <div className="w-1/2 p-6">
          <h2 className="text-xl font-semibold mb-4">Ask Questions</h2>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Ask something about your files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-700 rounded-md text-white focus:ring-blue-600 focus:ring-2"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
            >
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Send className="w-4 h-4 inline" /> Ask
                </>
              )}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-gray-900 p-4 rounded-md border border-gray-800"
                >
                  <div className="text-sm font-medium mb-2">{result.query}</div>
                  <div className="text-sm text-gray-300">{result.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
