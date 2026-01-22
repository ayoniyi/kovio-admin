import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBar = ({
  placeholder = "Search",
  onSearch,
  value: controlledValue,
  onChange,
  className = "",
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState("");

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
      />
      <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default SearchBar;
