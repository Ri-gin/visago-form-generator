// src/pages/index.tsx
import { useState } from 'react';
import { SCENARIOS } from '../components/scenarios';

type Field = {
  type: string;
  title: string;
};

type FormJson = {
  title: string;
  fields: Field[];
};

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [formJson, setFormJson] = useState<FormJson | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedVisaType('');
    const visaTypes = Object.keys(SCENARIOS[country] || {});
    const defaultVisa = visaTypes[0] || '';
    setSelectedVisaType(defaultVisa);
    setFormJson(SCENARIOS[country]?.[defaultVisa] || null);
  };

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaType = e.target.value;
    setSelectedVisaType(visaType);
    setFormJson(SCENARIOS[selectedCountry]?.[visaType] || null);
  };

  const handleGenerate = async () => {
    if (!formJson) return;

    try {
      const res = await fetch('/api/create-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formJson),
      });

      const data = await res.json();
      if (data.success && data.link) {
        window.open(data.link, '_blank');
      } else {
        console.error('Ошибка генерации формы:', data.error);
      }
    } catch (error) {
      console.error('Серверная ошибка:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/карта_фон.svg')]">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-xl shadow-xl animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2 justify-center text-blue-900 mb-6">
          🌍 Visago Auto Form
        </h1>

        <div className="space-y-4 w-72">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {Object.keys(SCENARIOS).map((country) => (
                <option key={country} value={country}>
                  {country.charAt(0).toUpperCase() + country.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Visa Type</label>
            <select
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={selectedVisaType}
              onChange={handleVisaTypeChange}
              disabled={!selectedCountry}
            >
              <option value="">Select Visa Type</option>
              {selectedCountry &&
                Object.keys(SCENARIOS[selectedCountry] || {}).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
            onClick={handleGenerate}
            disabled={!formJson}
          >
            Создать форму
          </button>
        </div>
      </div>
    </div>
  );
}
