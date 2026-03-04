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
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: error ? "#c0392b" : "var(--muted-foreground)",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--accent)", fontSize: "14px", lineHeight: 1 }}>·</span>
          )}
        </label>
        {hint && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              lineHeight: 1.5,
              opacity: 0.7,
            }}
          >
            {hint}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p
          style={{
            fontSize: "11px",
            color: "#c0392b",
            letterSpacing: "0.02em",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, style: externalStyle, ...props }: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "12px 0",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${error ? "#c0392b" : "var(--border)"}`,
        color: "var(--foreground)",
        fontSize: "14px",
        fontFamily: "var(--font-dm-sans), sans-serif",
        outline: "none",
        transition: "border-color 0.25s ease",
        ...externalStyle,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? "#c0392b" : "var(--accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = error ? "#c0392b" : "var(--border)";
        props.onBlur?.(e);
      }}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "12px 0",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${error ? "#c0392b" : "var(--border)"}`,
        color: "var(--foreground)",
        fontSize: "14px",
        fontFamily: "var(--font-dm-sans), sans-serif",
        outline: "none",
        resize: "none",
        minHeight: "100px",
        lineHeight: 1.65,
        transition: "border-color 0.25s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? "#c0392b" : "var(--accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = error ? "#c0392b" : "var(--border)";
        props.onBlur?.(e);
      }}
    />
  );
}
