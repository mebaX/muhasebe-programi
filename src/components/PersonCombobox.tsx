'use client';
import { useState, useEffect } from 'react';

export default function PersonCombobox({
  onSelect,
  type
}: {
  onSelect: (person: { id: number; name: string }) => void;
  type: 'customer' | 'supplier';
}) {
  const [persons, setPersons] = useState<{ id: number; name: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch(`/api/persons?type=${type}`)
      .then(res => res.json())
      .then(setPersons);
  }, [type]);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddNew = async () => {
    const response = await fetch('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputValue, type })
    });
    
    if (response.ok) {
      const newPerson = await response.json();
      setPersons([...persons, { id: newPerson.id, name: inputValue }]);
      onSelect({ id: newPerson.id, name: inputValue });
      setInputValue('');
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        placeholder={type === 'customer' ? 'Müşteri seçin' : 'Tedarikçi seçin'}
        className="w-full p-2 border rounded"
      />
      
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {filteredPersons.map(person => (
            <div
              key={person.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(person);
                setInputValue(person.name);
                setShowDropdown(false);
              }}
            >
              {person.name}
            </div>
          ))}
          {inputValue && !persons.some(p => p.name === inputValue) && (
            <div
              className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={handleAddNew}
            >
              <span>Yeni ekle: </span>
              <strong>{inputValue}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}