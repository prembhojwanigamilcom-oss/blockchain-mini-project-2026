import React from 'react';

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs tracking-wide',
    md: 'px-5 py-2.5 text-sm tracking-wide',
    lg: 'px-7 py-3.5 text-base tracking-wide',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#182C2A] text-[#FAF9F5] border border-[#182C2A] hover:bg-[#233C39] hover:border-[#233C39] active:bg-[#0F1E1C]',
    gold:
      'bg-[#9C815D] text-[#FAF9F5] border border-[#9C815D] hover:bg-[#876F4E] hover:border-[#876F4E] active:bg-[#735F43]',
    outline:
      'bg-transparent text-[#182C2A] border border-[#D8D2C5] hover:bg-[#EAE5D9] hover:border-[#182C2A]/40 active:bg-[#DFD9CB]',
    danger:
      'bg-[#8B2635] text-[#FAF9F5] border border-[#8B2635] hover:bg-[#721F2B] active:bg-[#5C1923]',
    ghost:
      'bg-transparent text-[#182C2A] border border-transparent hover:bg-[#D8D2C5]/30 active:bg-[#D8D2C5]/50',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#9C815D] disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
