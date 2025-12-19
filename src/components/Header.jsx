import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    // Add search logic here
  }

  return (
    <header className="m-7 px-6 py-4 bg-white border-b border-gray-200 flex items-center rounded-xl justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xs">
        <div className="relative ">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search user..."
            className="w-full pl-10 pr-4 px-2  py-3  bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-md text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alan" alt="Alan Roy Avatar" className="w-full h-full object-cover" />
        </div>
        
        {/* User Name */}
        <span className="text-xl  font-medium text-gray-900">Alan Roy</span>
      </div>
    </header>
  )
}