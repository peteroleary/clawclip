import React, { useState, useEffect } from "react";
import { X, Box, FileText, Image as ImageIcon, Video, FileCode, Download, Eye, Plus } from "lucide-react";

interface ArtifactsImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactsImmersiveScreen: React.FC<ArtifactsImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"files" | "images">("files");

  const [showModal, setShowModal] = useState(false);
  const [artTitle, setArtTitle] = useState("");
  const [artType, setArtType] = useState("file");
  const [artUrl, setArtUrl] = useState("");

  const [files, setFiles] = useState([
    { id: "f1", name: "implementation_plan.md", size: "4.2 KB", type: "doc", updatedAt: "Today, 01:19 AM" },
    { id: "f2", name: "bulletin-board-spec.md", size: "12.8 KB", type: "doc", updatedAt: "Yesterday" },
    { id: "f3", name: "firebase-adminsdk.json", size: "2.1 KB", type: "file", updatedAt: "Jul 22, 2026" },
  ]);

  const [images, setImages] = useState([
    { id: "i1", name: "3d_office_isometric_render.jpg", dimensions: "1920x1080", size: "480 KB", date: "Jul 25, 2026" },
    { id: "i2", name: "kanban_board_preview.png", dimensions: "1200x675", size: "210 KB", date: "Jul 24, 2026" },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showModal) setShowModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showModal, onClose]);

  if (!isOpen) return null;

  const handleAddArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;

    if (artType === "image" || artType === "video") {
      setImages([
        { id: `i_${Date.now()}`, name: artTitle.trim(), dimensions: "1920x1080", size: "120 KB", date: "Just now" },
        ...images,
      ]);
    } else {
      setFiles([
        { id: `f_${Date.now()}`, name: artTitle.trim(), size: "5.0 KB", type: artType, updatedAt: "Just now" },
        ...files,
      ]);
    }

    setArtTitle("");
    setArtUrl("");
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Artifacts & Asset Vault</h2>
              <p className="text-xs text-slate-400">Browse generated files, documents, logs, and media graphics</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("files")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === "files" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Files & Docs ({files.length})
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === "images" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Images & Video ({images.length})
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Artifact</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "files" ? (
            <div className="space-y-3 max-w-4xl mx-auto">
              {files.map((file) => (
                <div key={file.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-indigo-500/40 transition">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{file.name}</h4>
                      <p className="text-xs text-slate-400">{file.type} • {file.size} • Updated {file.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs transition">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
              {images.map((img) => (
                <div key={img.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-indigo-500/40 transition">
                  <div className="h-36 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800/80 text-slate-600">
                    <ImageIcon className="w-8 h-8 text-indigo-400/60" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{img.name}</h4>
                    <p className="text-xs text-slate-400">{img.dimensions} • {img.size} • {img.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Artifact Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-400" /> Create / Upload Artifact
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddArtifact} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Artifact Title / Filename</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. system_architecture_diagram.png"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Artifact Type</label>
                  <select
                    value={artType}
                    onChange={(e) => setArtType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="file">File (.json, .zip, .bin)</option>
                    <option value="image">Image (.png, .jpg, .svg)</option>
                    <option value="video">Video (.mp4, .webm)</option>
                    <option value="doc">Document (.md, .pdf, .txt)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">File Path or Media URL</label>
                  <input
                    type="text"
                    placeholder="https://... or file:///path/to/artifact"
                    value={artUrl}
                    onChange={(e) => setArtUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-950/50">
                    Add Artifact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
