/** @format */

import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center   w-[100%] h-[60vh] z-10">
      <Loader2 className="h-10 w-10 animate-spin text-kv-primary " />
    </div>
  );
};

export default Loader;
