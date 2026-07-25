import React, { useState, useEffect } from "react";
import { X, Building2, Plus, LayoutGrid, Box, Move, CheckCircle2, Ruler, Sparkles, Layers, Sliders } from "lucide-react";

interface FacilitiesImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export type FacilityTypePreset =
  | "Office"
  | "Lab"
  | "Store"
  | "Shop"
  | "Call Center"
  | "Restaurant"
  | "Warehouse"
  | "Salon"
  | "Clinic"
  | "Hotel"
  | "Motel"
  | "Theatre"
  | "Studio"
  | "Showroom"
  | "Hospital"
  | "Factory"
  | "House"
  | "Gym"
  | "Kitchen/Bakery"
  | "Boardroom"
  | "Classroom";

export interface FacilityItem {
  id: string;
  name: string;
  type: FacilityTypePreset;
  widthMeters: number;
  depthMeters: number;
  scaleFactor: number;
  capacity: number;
  isCurrentOffice?: boolean;
  objectsCount: number;
}

export interface PhysicalObject {
  id: string;
  name: string;
  category: "Furniture" | "Equipment" | "Appliance" | "Infrastructure";
  facilityId: string;
  posX: number;
  posY: number;
  posZ: number;
}

export const initialFacilities: FacilityItem[] = [
  { id: "f_class", name: "HQ Classroom Office", type: "Classroom", widthMeters: 12, depthMeters: 10, scaleFactor: 0.7, capacity: 16, isCurrentOffice: true, objectsCount: 12 },
  { id: "f_office", name: "Corporate Exec Office Suite", type: "Office", widthMeters: 25, depthMeters: 20, scaleFactor: 1.0, capacity: 40, objectsCount: 28 },
  { id: "f_lab", name: "AI Research & Physics Lab", type: "Lab", widthMeters: 18, depthMeters: 14, scaleFactor: 0.9, capacity: 12, objectsCount: 18 },
  { id: "f_store", name: "Flagship Retail Store", type: "Store", widthMeters: 20, depthMeters: 15, scaleFactor: 0.9, capacity: 30, objectsCount: 15 },
  { id: "f_shop", name: "Hardware & Repair Shop", type: "Shop", widthMeters: 15, depthMeters: 12, scaleFactor: 0.8, capacity: 10, objectsCount: 9 },
  { id: "f_cc", name: "24/7 Global Call Center", type: "Call Center", widthMeters: 35, depthMeters: 25, scaleFactor: 1.4, capacity: 85, objectsCount: 90 },
  { id: "f_rest", name: "Gourmet Bistro & Restaurant", type: "Restaurant", widthMeters: 30, depthMeters: 20, scaleFactor: 1.2, capacity: 60, objectsCount: 22 },
  { id: "f_wh", name: "Logistics Fulfillment Warehouse", type: "Warehouse", widthMeters: 60, depthMeters: 40, scaleFactor: 2.5, capacity: 120, objectsCount: 45 },
  { id: "f_salon", name: "Style & Beauty Salon", type: "Salon", widthMeters: 14, depthMeters: 10, scaleFactor: 0.7, capacity: 14, objectsCount: 12 },
  { id: "f_clinic", name: "Medical Diagnostics Clinic", type: "Clinic", widthMeters: 22, depthMeters: 16, scaleFactor: 1.0, capacity: 25, objectsCount: 20 },
  { id: "f_hotel", name: "Grand Resort & Hotel", type: "Hotel", widthMeters: 50, depthMeters: 35, scaleFactor: 2.2, capacity: 150, objectsCount: 110 },
  { id: "f_motel", name: "Highway Express Motel", type: "Motel", widthMeters: 40, depthMeters: 25, scaleFactor: 1.8, capacity: 45, objectsCount: 30 },
  { id: "f_theatre", name: "Cinema & Performance Theatre", type: "Theatre", widthMeters: 45, depthMeters: 30, scaleFactor: 2.0, capacity: 200, objectsCount: 40 },
  { id: "f_studio", name: "Media & Broadcast Studio", type: "Studio", widthMeters: 16, depthMeters: 14, scaleFactor: 0.8, capacity: 15, objectsCount: 24 },
  { id: "f_showroom", name: "Vehicle & Tech Showroom", type: "Showroom", widthMeters: 30, depthMeters: 22, scaleFactor: 1.4, capacity: 50, objectsCount: 16 },
  { id: "f_hospital", name: "Metro General Hospital", type: "Hospital", widthMeters: 80, depthMeters: 60, scaleFactor: 3.5, capacity: 300, objectsCount: 180 },
  { id: "f_factory", name: "Robotic Assembly Factory", type: "Factory", widthMeters: 75, depthMeters: 50, scaleFactor: 3.0, capacity: 100, objectsCount: 60 },
  { id: "f_house", name: "Residential Smart House", type: "House", widthMeters: 18, depthMeters: 15, scaleFactor: 0.9, capacity: 8, objectsCount: 25 },
  { id: "f_gym", name: "Fitness & Training Gym", type: "Gym", widthMeters: 28, depthMeters: 20, scaleFactor: 1.3, capacity: 55, objectsCount: 35 },
  { id: "f_kitchen", name: "Commercial Bakery & Kitchen", type: "Kitchen/Bakery", widthMeters: 16, depthMeters: 12, scaleFactor: 0.8, capacity: 12, objectsCount: 19 },
  { id: "f_boardroom", name: "Executive Glass Boardroom", type: "Boardroom", widthMeters: 10, depthMeters: 8, scaleFactor: 0.6, capacity: 14, objectsCount: 10 },
];

export const FacilitiesImmersiveScreen: React.FC<FacilitiesImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"facilities" | "floorplans" | "objects">("facilities");
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem>(initialFacilities[0]);

  // Modal State
  const [showConstructModal, setShowConstructModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);

  // Construct Form State
  const [facName, setFacName] = useState("");
  const [facType, setFacType] = useState<FacilityTypePreset>("Office");
  const [facWidth, setFacWidth] = useState("20");
  const [facDepth, setFacDepth] = useState("15");

  // Object Form State
  const [objName, setObjName] = useState("");
  const [objCat, setObjCat] = useState<"Furniture" | "Equipment">("Furniture");
  const [objX, setObjX] = useState("0");
  const [objY, setObjY] = useState("0");
  const [objZ, setObjZ] = useState("0");

  const [facilities, setFacilities] = useState<FacilityItem[]>(initialFacilities);
  const [objects, setObjects] = useState<PhysicalObject[]>([
    { id: "o1", name: "Executive Desk Workstation", category: "Furniture", facilityId: "f_class", posX: 0, posY: 0, posZ: 0 },
    { id: "o2", name: "HPC Server Cluster Rack", category: "Equipment", facilityId: "f_class", posX: -4, posY: 0, posZ: 2 },
    { id: "o3", name: "Interactive Whiteboard Screen", category: "Equipment", facilityId: "f_class", posX: 0, posY: 2, posZ: -4 },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showConstructModal) setShowConstructModal(false);
        else if (showObjectModal) setShowObjectModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showConstructModal, showObjectModal, onClose]);

  if (!isOpen) return null;

  const handleConstructFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) return;

    const w = parseFloat(facWidth) || 20;
    const d = parseFloat(facDepth) || 15;
    const scale = Math.round((Math.max(w, d) / 20) * 10) / 10;

    const newFac: FacilityItem = {
      id: `fac_${Date.now()}`,
      name: facName.trim(),
      type: facType,
      widthMeters: w,
      depthMeters: d,
      scaleFactor: scale,
      capacity: Math.round((w * d) / 6),
      objectsCount: 0,
    };

    setFacilities([newFac, ...facilities]);
    setSelectedFacility(newFac);
    setFacName("");
    setShowConstructModal(false);
  };

  const handlePlaceObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objName.trim()) return;

    setObjects([
      {
        id: `obj_${Date.now()}`,
        name: objName.trim(),
        category: objCat,
        facilityId: selectedFacility.id,
        posX: parseFloat(objX) || 0,
        posY: parseFloat(objY) || 0,
        posZ: parseFloat(objZ) || 0,
      },
      ...objects,
    ]);

    setObjName("");
    setShowObjectModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Facilities & Spatial Architecture</h2>
              <p className="text-xs text-slate-400">Construct floorplans, physical objects, equipment, and 21 scaled facility presets</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("facilities")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "facilities" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Facilities Catalog ({facilities.length})
              </button>
              <button
                onClick={() => setActiveTab("floorplans")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "floorplans" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Floorplans & Layouts
              </button>
              <button
                onClick={() => setActiveTab("objects")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "objects" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Physical Objects ({objects.length})
              </button>
            </div>

            <button
              onClick={() => setShowConstructModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>+ Construct Facility</span>
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
          {activeTab === "facilities" && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">21 Facility Presets & Scaled Layouts</h3>
                <span className="text-xs text-slate-400">Current Office: <strong className="text-emerald-400">Classroom</strong></span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`bg-slate-950 border p-5 rounded-2xl space-y-3 cursor-pointer transition shadow-lg ${
                      fac.isCurrentOffice
                        ? "border-emerald-500/80 bg-emerald-950/10 shadow-emerald-950/30"
                        : selectedFacility.id === fac.id
                        ? "border-amber-500/80 bg-amber-950/10"
                        : "border-slate-800 hover:border-amber-500/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{fac.name}</h4>
                        <span className="text-xs text-amber-400 font-mono">{fac.type} Preset</span>
                      </div>
                      {fac.isCurrentOffice && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          Active Office
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span className="text-slate-200">{fac.widthMeters}m x {fac.depthMeters}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scale Factor:</span>
                        <span className="text-slate-200">{fac.scaleFactor}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="text-slate-200">{fac.capacity} Occupants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "floorplans" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-400" /> Floorplan Layout Grid — {selectedFacility.name}
                </h3>
                <span className="text-xs font-mono text-amber-400">{selectedFacility.widthMeters}m x {selectedFacility.depthMeters}m</span>
              </div>

              {/* Floorplan Visual Canvas Grid */}
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 relative min-h-[350px] shadow-2xl">
                <div className="w-full max-w-lg h-64 bg-slate-900/80 border-2 border-dashed border-amber-500/40 rounded-xl relative flex items-center justify-center grid-bg">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-400">0,0</div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-amber-400">{selectedFacility.widthMeters}m, {selectedFacility.depthMeters}m</div>

                  <div className="text-center space-y-1">
                    <Building2 className="w-8 h-8 text-amber-400/80 mx-auto" />
                    <h4 className="font-bold text-white text-sm">{selectedFacility.name} Floorplan</h4>
                    <p className="text-xs text-slate-400">Scale {selectedFacility.scaleFactor}x • {selectedFacility.capacity} Max Occupants</p>
                  </div>
                </div>

                <div className="flex space-x-3 text-xs">
                  <button className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl font-semibold transition">
                    Adjust Walls & Boundaries
                  </button>
                  <button className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl font-semibold transition">
                    Configure Doorways
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "objects" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-400" /> Physical Objects, Furniture & Equipment
                </h3>
                <button
                  onClick={() => setShowObjectModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Place Physical Object
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {objects.map((obj) => (
                  <div key={obj.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-amber-500/40 transition">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {obj.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">X:{obj.posX} Y:{obj.posY} Z:{obj.posZ}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{obj.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1. Construct Facility Modal */}
        {showConstructModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" /> Construct New Facility
                </h3>
                <button onClick={() => setShowConstructModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConstructFacility} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. West Coast Innovation Hub"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Facility Preset Type (21 Presets)</label>
                  <select
                    value={facType}
                    onChange={(e) => setFacType(e.target.value as FacilityTypePreset)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {[
                      "Office", "Lab", "Store", "Shop", "Call Center", "Restaurant", "Warehouse",
                      "Salon", "Clinic", "Hotel", "Motel", "Theatre", "Studio", "Showroom",
                      "Hospital", "Factory", "House", "Gym", "Kitchen/Bakery", "Boardroom", "Classroom"
                    ].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Width (Meters)</label>
                    <input
                      type="number"
                      value={facWidth}
                      onChange={(e) => setFacWidth(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Depth (Meters)</label>
                    <input
                      type="number"
                      value={facDepth}
                      onChange={(e) => setFacDepth(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowConstructModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Construct Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Place Physical Object Modal */}
        {showObjectModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-400" /> Place Physical Object / Furniture
                </h3>
                <button onClick={() => setShowObjectModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePlaceObject} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Object Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ergonomic Office Desk"
                    value={objName}
                    onChange={(e) => setObjName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={objCat}
                    onChange={(e) => setObjCat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pos X</label>
                    <input
                      type="number"
                      value={objX}
                      onChange={(e) => setObjX(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pos Y</label>
                    <input
                      type="number"
                      value={objY}
                      onChange={(e) => setObjY(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pos Z</label>
                    <input
                      type="number"
                      value={objZ}
                      onChange={(e) => setObjZ(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowObjectModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Place Object
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
