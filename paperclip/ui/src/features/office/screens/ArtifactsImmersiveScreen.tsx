import React, { useState, useEffect } from "react";
import { X, Box, FileText, Image as ImageIcon, Download, Eye, Plus, Edit2, Trash2 } from "lucide-react";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

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
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showModal]);

  const handleAddArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;

    if (editingArtifactId) {
      if (artType === "image" || artType === "video") {
        setImages(images.map(img => img.id === editingArtifactId ? { ...img, name: artTitle.trim() } : img));
      } else {
        setFiles(files.map(f => f.id === editingArtifactId ? { ...f, name: artTitle.trim(), type: artType } : f));
      }
      setEditingArtifactId(null);
    } else {
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
    }

    setArtTitle("");
    setArtUrl("");
    setShowModal(false);
  };

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Artifacts & Asset Vault"
      subtitle="Browse generated files, documents, logs, and media graphics"
      icon={Box}
      iconColorClass="text-indigo-400"
      iconBgClass="bg-indigo-500/10 border-indigo-500/30"
      closeOnEsc={!showModal}
      showHeader={false}
    >
      {/* Control bar */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          <button onClick={() => setActiveTab("files")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "files" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Files & Docs ({files.length})</button>
          <button onClick={() => setActiveTab("images")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "images" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Images & Video ({images.length})</button>
        </div>

        {/* Action Button */}
        <div className="relative group shrink-0">
          <button
            onClick={() => {
              setEditingArtifactId(null);
              setArtTitle("");
              setArtType(activeTab === "images" ? "image" : "file");
              setShowModal(true);
            }}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
            Add Artifact
          </span>
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
                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <div className="relative group/tooltip">
                    <button className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 rounded-lg text-xs transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      View
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 rounded-lg text-xs transition">
                      <Download className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Download
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingArtifactId(file.id);
                        setArtTitle(file.name);
                        setArtType(file.type);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setFiles(files.filter(f => f.id !== file.id));
                      }}
                      className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {images.map((img) => (
              <div key={img.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-indigo-500/40 transition">
                <div className="h-36 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800/80 text-slate-650">
                  <ImageIcon className="w-8 h-8 text-indigo-400/60" />
                </div>
                <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <h4 className="font-bold text-white text-sm">{img.name}</h4>
                    <p className="text-xs text-slate-400">{img.dimensions} • {img.size} • {img.date}</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditingArtifactId(img.id);
                          setArtTitle(img.name);
                          setArtType("image");
                          setShowModal(true);
                        }}
                        className="p-1.5 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Edit
                      </span>
                    </div>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setImages(images.filter(i => i.id !== img.id));
                        }}
                        className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
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
                <Box className="w-5 h-5 text-indigo-400" /> {editingArtifactId ? "Edit Artifact details" : "Create / Upload Artifact"}
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
                  {editingArtifactId ? "Save Changes" : "Add Artifact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
