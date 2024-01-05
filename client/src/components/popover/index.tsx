"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface PopoverButtonProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
interface PopoverContentProps {
  isOpen: boolean;
}
interface PopoverProps {
  button: (buttonProps: PopoverButtonProps) => JSX.Element;
  content: (contentProps: PopoverContentProps) => JSX.Element;
}
export default function Popover({ button, content }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (document && isOpen) {
      const onClick = (e: MouseEvent) => {
        if (!(e.target as Element).closest(".popover__content")) {
          setIsOpen(false);
        }
      };

      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <div className="h-fit w-fit">{button({ setIsOpen })}</div>
      <div className="h-fit w-fit popover__content absolute z-50 right-0 mt-1">
        {content({ isOpen })}
      </div>
    </div>
  );
}
