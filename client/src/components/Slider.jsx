import { useState } from 'react';

export default function Slider({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium" style={{ color: '#c9d1d9' }}>
          {label}
        </label>
        <span
          className="text-lg font-semibold"
          style={{ color: '#00d4ff' }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          backgroundColor: '#30363d',
          background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${((value - min) / (max - min)) * 100}%, #30363d ${((value - min) / (max - min)) * 100}%, #30363d 100%)`,
        }}
      />
    </div>
  );
}
