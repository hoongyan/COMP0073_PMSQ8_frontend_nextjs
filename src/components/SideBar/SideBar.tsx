import React from "react";
import { AccountToggle } from "./AccountToggle";
import { RouteSelect } from "./RouteSelect";

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
