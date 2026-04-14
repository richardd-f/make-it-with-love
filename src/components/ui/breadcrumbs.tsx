import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export const BreadcrumbList = ({ items, className = "" }: { items: BreadcrumbItem[], className?: string }) => {
  return (
    <nav 
      className={`flex font-sans font-light text-gray-500 text-base tracking-widest items-center gap-3 ${className}`} 
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.active ? (
            <span className="bg-[#f79d1c] text-white px-5 py-2 rounded-full shadow-sm uppercase truncate max-w-xs">
              {item.label}
            </span>
          ) : item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-white hover:bg-[#f79d1c]/80 transition-colors bg-white/60 px-5 py-2 rounded-full shadow-sm uppercase"
            >
              {item.label}
            </Link>
          ) : (
            <span className="bg-white/60 px-5 py-2 rounded-full shadow-sm uppercase truncate max-w-xs">
              {item.label}
            </span>
          )}
          
          {idx < items.length - 1 && (
            <span className="text-gray-400 font-bold">&gt;</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
