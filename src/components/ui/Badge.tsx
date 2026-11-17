import React from 'react';

export type BadgeVariant = 'authentic' | 'revoked' | 'unregistered' | 'neutral' | 'gold' | 'forest';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  dot = true,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    authentic: {
      bg: 'bg-[#182C2A]/5',
      text: 'text-[#182C2A]',
      border: 'border-[#182C2A]/30',
      dotColor: 'bg-[#235347]',
    },
    revoked: {
      bg: 'bg-[#8B2635]/5',
      text: 'text-[#8B2635]',
      border: 'border-[#8B2635]/30',
      dotColor: 'bg-[#8B2635]',
    },
    unregistered: {
      bg: 'bg-[#735F43]/10',
      text: 'text-[#735F43]',
      border: 'border-[#735F43]/30',
      dotColor: 'bg-[#735F43]',
    },
    gold: {
      bg: 'bg-[#9C815D]/10',
      text: 'text-[#735F43]',
      border: 'border-[#9C815D]/40',
      dotColor: 'bg-[#9C815D]',
    },
    forest: {
      bg: 'bg-[#182C2A]',
      text: 'text-[#FAF9F5]',
      border: 'border-[#182C2A]',
      dotColor: 'bg-[#9C815D]',
    },
    neutral: {
      bg: 'bg-[#D8D2C5]/20',
      text: 'text-[#182C2A]/80',
      border: 'border-[#D8D2C5]',
      dotColor: 'bg-[#B8B0A0]',
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
};
