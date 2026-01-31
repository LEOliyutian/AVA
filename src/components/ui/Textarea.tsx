import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="input-item" style={{ flex: 1 }}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} {...props} />
    </div>
  );
}
