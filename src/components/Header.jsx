import React from 'react'

export default function Header({ onToggle }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="p-2 border rounded">☰</button>
        <h1 className="text-lg font-semibold">AI Wingman</h1>
      </div>
      <div>Welcome</div>
    </header>
  )
}
