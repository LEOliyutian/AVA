import React from 'react';

interface FormGroupProps {
  title: string;
  borderColor?: string;
  children: React.ReactNode;
  titleRight?: React.ReactNode;
}

export function FormGroup({ title, borderColor, children, titleRight }: FormGroupProps) {
  return (
    <div
      className="form-group"
      style={borderColor ? { borderLeft: `4px solid ${borderColor}` } : undefined}
    >
      <div className="form-title">
        <span>{title}</span>
        {titleRight}
      </div>
      {children}
    </div>
  );
}
