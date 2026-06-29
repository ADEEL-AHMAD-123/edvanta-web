import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button styles as a standalone (non-client) module so server components — like
 * the marketing landing page — can call buttonVariants() to style links.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
        secondary:
          'bg-card text-foreground border border-border hover:bg-muted',
        soft: 'bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70',
        ghost: 'text-foreground hover:bg-muted',
        danger: 'bg-danger text-danger-foreground hover:bg-danger/90 shadow-sm',
        outline:
          'border border-primary text-primary hover:bg-primary-soft',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
