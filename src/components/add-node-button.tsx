"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "./ui/button";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [openSelector, setOpenSelector] = useState(false);
  return (
    <NodeSelector open={openSelector} onOpenChange={setOpenSelector}>
      <Button
        onClick={() => {
          setOpenSelector(true);
        }}
        size="icon"
        variant="outline"
        className=" bg-background"
      >
        <PlusIcon className=" size-4" />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
