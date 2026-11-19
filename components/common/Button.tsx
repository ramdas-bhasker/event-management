import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'whatsapp'
  | 'whatsapp-tint'
  | 'danger'
  | 'danger-ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  whatsapp: 'btn-whatsapp',
  'whatsapp-tint': 'btn-whatsapp-tint',
  danger: 'btn-danger',
  'danger-ghost': 'btn-danger-ghost',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'btn',
        sizeClasses[size],
        variantClasses[variant],
        block && 'btn-block',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
