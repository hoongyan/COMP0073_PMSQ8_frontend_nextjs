import React from "react";
import { AccountToggle } from "./AccountToggle";
import { Search } from "./Search";
import { RouteSelect } from "./RouteSelect";
import { Plan } from "./Plan";

export const Sidebar = () => {
  return (
    <div>
      <div className="w-60">
        <AccountToggle />
        <RouteSelect />
      </div>
    </div>
  );
};
