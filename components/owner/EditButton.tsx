"use client";

import { useOwner } from "@/context/OwnerContext";
import { cn } from "@/lib/utils";

interface EditButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

/**
 * Small edit icon button
 * Only visible when isOwner = true
 */
export function EditButton({ onClick, className, label = "Edit" }: EditButtonProps) {
  const { isOwner } = useOwner();

  if (!isOwner) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20",
        className
      )}
      aria-label={label}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}
