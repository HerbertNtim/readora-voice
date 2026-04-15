import * as React from 'react';
import { cn } from '@/lib/utils';

type FormProps = React.FormHTMLAttributes<HTMLFormElement>;
type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;
type FormItemProps = React.HTMLAttributes<HTMLDivElement>;
type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
type FormControlProps = React.HTMLAttributes<HTMLDivElement>;
type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;
type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function Form({ className, ...props }: FormProps) {
  return <form className={cn('space-y-0', className)} {...props} />;
}

function FormField({ className, ...props }: FormFieldProps) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn('space-y-3', className)} {...props} />;
}

function FormLabel({ className, ...props }: FormLabelProps) {
  return <label className={cn('form-label', className)} {...props} />;
}

function FormControl({ className, ...props }: FormControlProps) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

function FormMessage({ className, ...props }: FormMessageProps) {
  return <p className={cn('text-sm text-[#9f4a2d]', className)} {...props} />;
}

function FormDescription({ className, ...props }: FormDescriptionProps) {
  return <p className={cn('text-sm text-[#3d485e]', className)} {...props} />;
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
};
