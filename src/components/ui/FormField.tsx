"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, hint, required, children, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <label className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {label}
          {required && (
            <span className="text-xs" style={{ color: "var(--accent)" }}>*</span>
          )}
        </label>
        {hint && (
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {hint}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs" style={{ color: "#e05252" }}>
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ${className}`}
      style={{
        background: "var(--surface)",
        border: `1px solid ${error ? "#e05252" : "var(--border)"}`,
        color: "var(--foreground)",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = error ? "#e05252" : "var(--accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? "#e05252" : "var(--border)";
        props.onBlur?.(e);
      }}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 resize-none ${className}`}
      style={{
        background: "var(--surface)",
        border: `1px solid ${error ? "#e05252" : "var(--border)"}`,
        color: "var(--foreground)",
        outline: "none",
        minHeight: "120px",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = error ? "#e05252" : "var(--accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? "#e05252" : "var(--border)";
        props.onBlur?.(e);
      }}
    />
  );
}
