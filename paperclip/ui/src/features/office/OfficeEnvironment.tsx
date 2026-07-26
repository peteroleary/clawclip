import React from "react";
import { useOfficeStore } from "../../store/officeStore";

import { ClassroomPreset } from "./presets/ClassroomPreset";
import { OfficePreset } from "./presets/OfficePreset";
import { FactoryPreset } from "./presets/FactoryPreset";
import { BakeryPreset } from "./presets/BakeryPreset";
import { LabPreset } from "./presets/LabPreset";
import { StorePreset } from "./presets/StorePreset";
import { ShopPreset } from "./presets/ShopPreset";
import { CallCenterPreset } from "./presets/CallCenterPreset";
import { RestaurantPreset } from "./presets/RestaurantPreset";
import { WarehousePreset } from "./presets/WarehousePreset";
import { SalonPreset } from "./presets/SalonPreset";
import { ClinicPreset } from "./presets/ClinicPreset";
import { HotelPreset } from "./presets/HotelPreset";
import { MotelPreset } from "./presets/MotelPreset";
import { TheatrePreset } from "./presets/TheatrePreset";
import { StudioPreset } from "./presets/StudioPreset";
import { ShowroomPreset } from "./presets/ShowroomPreset";
import { HospitalPreset } from "./presets/HospitalPreset";
import { HousePreset } from "./presets/HousePreset";
import { GymPreset } from "./presets/GymPreset";
import { BoardroomPreset } from "./presets/BoardroomPreset";
import { BankPreset } from "./presets/BankPreset";

interface OfficeEnvironmentProps {
  onDeskClick?: (deskId: string) => void;
}

export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onDeskClick }) => {
  const activeFacility = useOfficeStore((state) => state.activeFacility);

  const type = activeFacility?.type;

  return (
    <group>
      {type === "Classroom" && <ClassroomPreset onDeskClick={onDeskClick} />}
      {type === "Office" && <OfficePreset onDeskClick={onDeskClick} />}
      {type === "Factory" && <FactoryPreset />}
      {type === "Kitchen/Bakery" && <BakeryPreset />}
      {type === "Lab" && <LabPreset />}
      {type === "Store" && <StorePreset />}
      {type === "Shop" && <ShopPreset />}
      {type === "Call Center" && <CallCenterPreset />}
      {type === "Restaurant" && <RestaurantPreset />}
      {type === "Warehouse" && <WarehousePreset />}
      {type === "Salon" && <SalonPreset />}
      {type === "Clinic" && <ClinicPreset />}
      {type === "Hotel" && <HotelPreset />}
      {type === "Motel" && <MotelPreset />}
      {type === "Theatre" && <TheatrePreset />}
      {type === "Studio" && <StudioPreset />}
      {type === "Showroom" && <ShowroomPreset />}
      {type === "Hospital" && <HospitalPreset />}
      {type === "House" && <HousePreset />}
      {type === "Gym" && <GymPreset />}
      {type === "Boardroom" && <BoardroomPreset />}
      {type === "Bank" && <BankPreset />}

      {/* Fallback if facility type is unknown or default */}
      {!type && <ClassroomPreset onDeskClick={onDeskClick} />}
    </group>
  );
};
