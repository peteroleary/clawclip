import React, { useState, useEffect } from "react";
import { X, Building2, Plus, LayoutGrid, Box, Move, CheckCircle2, Ruler, Sparkles, Layers, Sliders, Edit2, Trash2 } from "lucide-react";
import { useOfficeStore } from "../../../store/officeStore";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

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
  | "Classroom"
  | "Bank";

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
  { id: "f_bank", name: "Central City Bank Branch", type: "Bank", widthMeters: 22, depthMeters: 16, scaleFactor: 1.0, capacity: 30, objectsCount: 22 },
];

export const FacilitiesImmersiveScreen: React.FC<FacilitiesImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const activeFacility = useOfficeStore((state) => state.activeFacility);
  const setActiveFacility = useOfficeStore((state) => state.setActiveFacility);

  const [activeTab, setActiveTab] = useState<"facilities" | "floorplans" | "objects">("facilities");
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem>(initialFacilities[0]);

  // Modal State
  const [showConstructModal, setShowConstructModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [editingObjectId, setEditingObjectId] = useState<string | null>(null);

  // Construct Form State
  const [facName, setFacName] = useState("");
  const [facType, setFacType] = useState<FacilityTypePreset>("Office");
  const [facWidth, setFacWidth] = useState("20");
  const [facDepth, setFacDepth] = useState("15");

  // Object Form State
  const [objName, setObjName] = useState("");
  const [objCat, setObjCat] = useState<"Furniture" | "Equipment" | "Appliance" | "Infrastructure">("Furniture");
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showConstructModal, showObjectModal]);

  const handleConstructFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) return;

    const w = parseFloat(facWidth) || 20;
    const d = parseFloat(facDepth) || 15;
    const scale = Math.round((Math.max(w, d) / 20) * 10) / 10;

    if (editingFacilityId) {
      setFacilities(facilities.map(fac => fac.id === editingFacilityId ? {
        ...fac,
        name: facName.trim(),
        type: facType,
        widthMeters: w,
        depthMeters: d,
        scaleFactor: scale,
        capacity: Math.round((w * d) / 6),
      } : fac));
      setEditingFacilityId(null);
    } else {
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
    }

    setFacName("");
    setShowConstructModal(false);
  };

  const handlePlaceObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objName.trim()) return;

    if (editingObjectId) {
      setObjects(objects.map(obj => obj.id === editingObjectId ? {
        ...obj,
        name: objName.trim(),
        category: objCat,
        posX: parseFloat(objX) || 0,
        posY: parseFloat(objY) || 0,
        posZ: parseFloat(objZ) || 0,
      } : obj));
      setEditingObjectId(null);
    } else {
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
    }

    setObjName("");
    setShowObjectModal(false);
  };

  const getTabAction = () => {
    switch (activeTab) {
      case "facilities":
        return { label: "Construct Facility", action: () => { setEditingFacilityId(null); setFacName(""); setFacType("Office"); setFacWidth("20"); setFacDepth("15"); setShowConstructModal(true); } };
      case "objects":
        return { label: "Place Object", action: () => { setEditingObjectId(null); setObjName(""); setObjCat("Furniture"); setObjX("0"); setObjY("0"); setObjZ("0"); setShowObjectModal(true); } };
      default:
        return null;
    }
  };

  const tabAction = getTabAction();

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Facilities & Spatial Architecture"
      subtitle="Construct floorplans, physical objects, equipment, and 21 scaled facility presets"
      icon={Building2}
      iconColorClass="text-amber-400"
      iconBgClass="bg-amber-500/10 border-amber-500/30"
      closeOnEsc={!showConstructModal && !showObjectModal}
      showHeader={false}
    >
      {/* Control bar */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          <button onClick={() => setActiveTab("facilities")} className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === "facilities" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Facilities Catalog ({facilities.length})</button>
          <button onClick={() => setActiveTab("floorplans")} className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === "floorplans" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Floorplans & Layouts</button>
          <button onClick={() => setActiveTab("objects")} className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === "objects" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Physical Objects ({objects.length})</button>
        </div>

        {/* Action Button */}
        {tabAction && (
          <div className="relative group shrink-0">
            <button
              onClick={tabAction.action}
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              {tabAction.label}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "facilities" && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center pb-1 text-xs text-slate-450 border-b border-slate-900 mb-2">
              <span>{facilities.length} Facility Presets & Scaled Layouts</span>
              <span>Current Office: <strong className="text-emerald-400">{activeFacility?.name || "None"}</strong></span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`bg-slate-950 border p-5 rounded-2xl space-y-3 cursor-pointer transition shadow-lg relative flex flex-col justify-between ${
                    activeFacility?.id === fac.id
                      ? "border-emerald-500/80 bg-emerald-950/10 shadow-emerald-950/30"
                      : selectedFacility.id === fac.id
                      ? "border-amber-500/80 bg-amber-950/10"
                      : "border-slate-800 hover:border-amber-500/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{fac.name}</h4>
                        <span className="text-xs text-amber-400 font-mono">{fac.type} Preset</span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {activeFacility?.id === fac.id && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold mr-1">
                            Active
                          </span>
                        )}

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              setEditingFacilityId(fac.id);
                              setFacName(fac.name);
                              setFacType(fac.type);
                              setFacWidth(String(fac.widthMeters));
                              setFacDepth(String(fac.depthMeters));
                              setShowConstructModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Edit
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              setFacilities(facilities.filter(f => f.id !== fac.id));
                            }}
                            className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Delete
                          </span>
                        </div>
                      </div>
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

                  {activeFacility?.id !== fac.id && selectedFacility.id === fac.id && (
                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFacility(fac);
                        }}
                        className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold transition"
                      >
                        Set as Active Facility
                      </button>
                    </div>
                  )}
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
            <div className="grid grid-cols-3 gap-4">
              {objects.map((obj) => (
                <div key={obj.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {obj.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">X:{obj.posX} Y:{obj.posY} Z:{obj.posZ}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{obj.name}</h4>
                  </div>
                  <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-900 mt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditingObjectId(obj.id);
                          setObjName(obj.name);
                          setObjCat(obj.category);
                          setObjX(String(obj.posX));
                          setObjY(String(obj.posY));
                          setObjZ(String(obj.posZ));
                          setShowObjectModal(true);
                        }}
                        className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Edit
                      </span>
                    </div>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setObjects(objects.filter(o => o.id !== obj.id));
                        }}
                        className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
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
                <Building2 className="w-5 h-5 text-amber-400" /> {editingFacilityId ? "Edit Facility Details" : "Construct New Facility"}
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Facility Preset Type (21 Presets)</label>
                <select
                  value={facType}
                  onChange={(e) => setFacType(e.target.value as FacilityTypePreset)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
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
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Depth (Meters)</label>
                  <input
                    type="number"
                    value={facDepth}
                    onChange={(e) => setFacDepth(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowConstructModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                  {editingFacilityId ? "Save Changes" : "Construct Facility"}
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
                <Box className="w-5 h-5 text-amber-400" /> {editingObjectId ? "Edit Physical Object" : "Place Physical Object / Furniture"}
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Category</label>
                <select
                  value={objCat}
                  onChange={(e) => setObjCat(e.target.value as any)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Furniture">Furniture</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Appliance">Appliance</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Pos X</label>
                  <input
                    type="number"
                    value={objX}
                    onChange={(e) => setObjX(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Pos Y</label>
                  <input
                    type="number"
                    value={objY}
                    onChange={(e) => setObjY(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Pos Z</label>
                  <input
                    type="number"
                    value={objZ}
                    onChange={(e) => setObjZ(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowObjectModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                  {editingObjectId ? "Save Changes" : "Place Object"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
