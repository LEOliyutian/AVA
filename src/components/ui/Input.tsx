import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="input-item">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...props} />
    </div>
  );
}
