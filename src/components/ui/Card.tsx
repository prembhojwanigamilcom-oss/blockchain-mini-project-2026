import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer,
}) => {
  return (
    <div className={`bg-[#FAF9F5] border border-[#D8D2C5] shadow-subtle ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-5 border-b border-[#D8D2C5]/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {title && (
              <h3 className="font-serif text-lg font-semibold text-[#182C2A] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#182C2A]/60 mt-0.5 tracking-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && (
        <div className="px-6 py-4 bg-[#F3F0E8]/40 border-t border-[#D8D2C5]/80 text-xs text-[#182C2A]/70">
          {footer}
        </div>
      )}
    </div>
  );
};
