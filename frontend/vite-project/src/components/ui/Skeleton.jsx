import React from 'react';

export function Skeleton({ className = '', style, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] border border-white/5 ${className}`}
      style={style}
      {...props}
    />
  );
}

export default Skeleton;
