// src/components/PersonCombobox.tsx
"use client";
import { useState, useEffect } from "react";

interface Person {
  id: number;
  name: string;
}

export default function PersonCombobox({
  type,
  onSelect,
  value,
  onChange,
}: {
  type: "customer" | "supplier";
  onSelect: (person: Person) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [showBadge, setShowBadge] = useState(false); // Yeni eklenen kişi için badge

  useEffect(() => {
    fetch(`/api/persons?type=${type}`)
      .then((res) => res.json())
      .then(setPersons);
  }, [type]);

  const handleAddNew = async () => {
    if (!inputValue.trim()) return;

    try {
      const response = await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputValue,
          type,
        }),
      });

      if (response.ok) {
        const newPerson = await response.json();
        setPersons([...persons, newPerson]);
        onSelect(newPerson);
        setShowBadge(true); // Badge'i göster
        setTimeout(() => setShowBadge(false), 2000); // 2 saniye sonra gizle
      }
    } catch (error) {
      console.error("Kişi eklenirken hata:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={
          type === "customer"
            ? "Müşteri seçin veya yeni ekleyin"
            : "Tedarikçi seçin veya yeni ekleyin"
        }
        className="w-full p-2 border rounded"
        list={`persons-${type}`}
      />

      <datalist id={`persons-${type}`}>
        {persons.map((person) => (
          <option key={person.id} value={person.name} />
        ))}
      </datalist>

      {inputValue && !persons.some((p) => p.name === inputValue) && (
        <button
          type="button"
          onClick={handleAddNew}
          className="absolute right-2 top-2 text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded"
        >
          Yeni Ekle
        </button>
      )}

      {showBadge && (
        <span className="absolute right-24 top-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs">
          Yeni kişi eklendi!
        </span>
      )}
    </div>
  );
}
