import React, { useState, useEffect } from "react";
import { X, Link2, Search, Link as LinkIcon, DatabaseZap } from "lucide-react";
import { useOfficeStore } from "../../../store/officeStore.js";
import { supabase } from "../../../lib/supabaseClient.js";

export const GlobalLinkModal: React.FC = () => {
  const linkModal = useOfficeStore(state => state.linkModal);
  const closeLinkModal = useOfficeStore(state => state.closeLinkModal);

  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [relType, setRelType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (linkModal?.isOpen) {
      setLoading(true);
      setError(null);
      
      const fetchNodes = async () => {
        const { data, error: err } = await supabase.from('nodes').select('*');
        if (err) {
          console.error("Failed to load nodes", err);
        } else {
          setNodes(data || []);
        }
        setLoading(false);
      };
      
      fetchNodes();
    }
  }, [linkModal?.isOpen]);

  if (!linkModal?.isOpen) return null;

  const filteredNodes = nodes.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) && n.id !== linkModal.sourceNodeId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTargetIds.length === 0 || !relType) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const edgesToInsert = selectedTargetIds.map(targetId => ({
        source_id: linkModal.sourceNodeId,
        target_id: targetId,
        relationship_type: relType,
        company_id: "default_company" // usually from auth context
      }));

      const { error: insertErr } = await supabase.from('edges').insert(edgesToInsert);

      if (insertErr) {
        if (insertErr.code === '23503') { 
          throw new Error("One of these entities doesn't exist in the remote database yet!");
        }
        throw new Error(insertErr.message);
      }

      closeLinkModal();
      
      setSelectedTargetIds([]);
      setRelType("");
      setSearchQuery("");

    } catch (err: any) {
      setError(err.message || "Failed to create link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#06090d]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Create Direct Link</h3>
              <p className="text-xs text-slate-400">Connect entities in the global 3D graph</p>
            </div>
          </div>
          <button onClick={closeLinkModal} className="text-slate-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-300 rounded-xl text-xs flex gap-2">
              <DatabaseZap className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Source Entity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Entity</label>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center space-x-3 cursor-not-allowed opacity-80">
              <div className="text-xs font-bold text-indigo-400 uppercase w-16">{linkModal.sourceNodeType}</div>
              <div className="text-sm font-semibold text-white">{linkModal.sourceNodeName}</div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-slate-800 p-1 rounded-full border border-slate-700">
              <LinkIcon className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Target Entity Search & Select */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Entities (Check all that apply)</label>
              <span className="text-[10px] text-indigo-400 font-bold">{selectedTargetIds.length} selected</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search entities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-t-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            
            <div className="max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-b-xl border-t-0 p-1 space-y-0.5">
              {loading ? (
                <div className="p-3 text-center text-xs text-slate-500">Loading nodes...</div>
              ) : filteredNodes.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">No matching entities found.</div>
              ) : (
                filteredNodes.map(node => {
                  const isSelected = selectedTargetIds.includes(node.id);
                  return (
                    <label 
                      key={node.id}
                      className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center space-x-3 transition select-none ${
                        isSelected ? 'bg-indigo-600/20 border border-indigo-500/30 text-white' : 'hover:bg-slate-800 border border-transparent text-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTargetIds([...selectedTargetIds, node.id]);
                          } else {
                            setSelectedTargetIds(selectedTargetIds.filter(id => id !== node.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800"
                      />
                      <span className={`text-[10px] font-bold uppercase w-16 shrink-0 ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                        {node.type}
                      </span>
                      <span className="text-sm font-medium truncate">{node.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Relationship Type */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Relationship Type</label>
            <div className="relative">
              <select 
                required
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Select relationship type...</option>
                <option value="belongs_to">belongs_to</option>
                <option value="depends_on">depends_on</option>
                <option value="blocks">blocks</option>
                <option value="reports_to">reports_to</option>
                <option value="manages">manages</option>
                <option value="works_on">works_on</option>
                <option value="related_to">related_to</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">Links are bi-directional, but you define the source {"->"} target verb.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-2">
            <button 
              type="button" 
              onClick={closeLinkModal}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting || selectedTargetIds.length === 0 || !relType}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-900/50"
            >
              {submitting ? 'Linking...' : `Create ${selectedTargetIds.length} Link${selectedTargetIds.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
