import { useEffect, useMemo, useRef, useState } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";

import {
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}

function CountrySelect({ value, onChange, disabled = false }) {
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const countries = useMemo(() => {
    return getCountries().map((country) => ({
      code: country,
      name: en[country],
      callingCode: `+${getCountryCallingCode(country)}`,
    }));
  }, []);

  const selectedCountry =
    countries.find((country) => country.code === value) || null;

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return countries;
    }

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(normalizedSearch) ||
        country.code.toLowerCase().includes(normalizedSearch) ||
        country.callingCode.includes(normalizedSearch)
      );
    });
  }, [countries, search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen]);

  function handleToggle() {
    if (disabled) return;

    setIsOpen((open) => !open);

    if (isOpen) {
      setSearch("");
    }
  }

  function handleSelect(country) {
    onChange(country.code);
    setIsOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 items-center gap-2 rounded-lg px-2.5 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-lg leading-none">
          {selectedCountry ? getFlagEmoji(selectedCountry.code) : "🌐"}
        </span>

        <span className="hidden font-medium text-gray-700 sm:block">
          {selectedCountry?.callingCode || ""}
        </span>

        <HiOutlineChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-[200] w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search country..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900 transition outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <div
            role="listbox"
            aria-label="Country"
            className="max-h-72 overflow-y-auto p-1.5"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === value;

                return (
                  <button
                    key={country.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl leading-none">
                      {getFlagEmoji(country.code)}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                      {country.name}
                    </span>

                    <span className="shrink-0 text-xs font-medium text-gray-400">
                      {country.callingCode}
                    </span>

                    {isSelected && (
                      <HiOutlineCheck className="h-4 w-4 shrink-0 text-gray-900" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No country found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try another country name or calling code.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CountrySelect;
