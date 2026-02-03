"use client";

import { useEffect, useRef } from "react";
import { useOwner } from "@/context/OwnerContext";

/**
 * Hidden keyboard shortcut listener
 * Triggers owner login modal when: Shift + O pressed 3 times within 5 seconds
 */
export function OwnerKeyListener() {
  const { openLoginModal } = useOwner();
  const pressCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + O
      if (event.shiftKey && event.key === "O") {
        pressCountRef.current += 1;

        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Reset counter after 5 seconds
        timeoutRef.current = setTimeout(() => {
          pressCountRef.current = 0;
        }, 5000);

        // Trigger login modal on 3rd press
        if (pressCountRef.current === 3) {
          openLoginModal();
          pressCountRef.current = 0;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [openLoginModal]);

  return null; // No UI - pure listener
}
