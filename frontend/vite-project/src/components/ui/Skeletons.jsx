import React from 'react';
import Skeleton from './Skeleton';

export function PortfolioCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-[280px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-24 h-6 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-7 mb-2 rounded-lg" />
            <Skeleton className="w-1/2 h-4 mb-6 rounded-md" />
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-20 h-6 rounded-lg" />
              <Skeleton className="w-16 h-6 rounded-lg" />
            </div>
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <Skeleton className="w-28 h-4 rounded" />
            <Skeleton className="w-16 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden p-4">
          <Skeleton className="w-full h-48 rounded-xl mb-4" />
          <Skeleton className="w-2/3 h-6 mb-2 rounded-lg" />
          <Skeleton className="w-full h-4 mb-4 rounded" />
          <div className="flex gap-2">
            <Skeleton className="w-1/2 h-10 rounded-xl" />
            <Skeleton className="w-1/2 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <Skeleton className="w-20 h-4 mb-2 rounded" />
            <Skeleton className="w-32 h-8 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
        <Skeleton className="w-48 h-6 mb-4 rounded-lg" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    </div>
  );
}
