import React from "react";

export const ShelterSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white border border-surface-container shadow-sm animate-pulse space-y-4"
        >
          {/* Header & Badge skeleton */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-surface-container rounded-md w-3/4"></div>
              <div className="h-3.5 bg-surface-container rounded-md w-1/2"></div>
            </div>
            <div className="h-6 w-24 bg-surface-container rounded-full shrink-0"></div>
          </div>

          {/* Address skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-container shrink-0"></div>
            <div className="h-3.5 bg-surface-container rounded-md w-4/5"></div>
          </div>

          {/* Meta specs skeleton */}
          <div className="flex items-center gap-4 pt-2 border-t border-surface-container-low">
            <div className="h-4 bg-surface-container rounded w-28"></div>
            <div className="h-4 bg-surface-container rounded w-32"></div>
          </div>

          {/* Action button skeleton */}
          <div className="pt-2 flex justify-between items-center">
            <div className="h-9 bg-surface-container rounded-xl w-32"></div>
            <div className="h-9 bg-surface-container rounded-xl w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
