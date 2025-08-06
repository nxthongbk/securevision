import React from 'react';

interface SearchFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  categoryOptions: string[];
  statusOptions: string[];
  placeholder?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  categoryOptions,
  statusOptions,
  placeholder = 'Tìm kiếm theo từ khóa',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col tablet:flex-row space-y-4 tablet:space-y-0 tablet:space-x-4">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-filter h-4 w-4 text-gray-400"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categoryOptions.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
