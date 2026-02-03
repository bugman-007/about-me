"use client";

import { useOwner } from "@/context/OwnerContext";
import { Button } from "@/components/ui/button";

/**
 * Fixed toolbar shown when owner is authenticated
 * Provides quick access to logout
 */
export function OwnerToolbar() {
  const { isOwner, logout, user } = useOwner();

  if (!isOwner) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 rounded-lg border border-border bg-card p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">
            Owner Mode
          </span>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="h-7 text-xs"
        >
          Logout
        </Button>
      </div>
      {user?.email && (
        <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
      )}
    </div>
  );
}
