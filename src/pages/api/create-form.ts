import { useState } from 'react';
import { SCENARIOS } from '../components/scenarios';

type Country = keyof typeof SCENARIOS;
type VisaType<C extends Country> = keyof typeof SCENARIOS[C];
type Field = { type: string; title: string };
type FormJson = { title: string; fields: Field[] };

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country | ''>('');
  const [selectedVisaType, setSelectedVisaType] = useState<string>('');
  const [formJson, setFormJson] = useState<FormJson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value as Country;
    setSelectedCountry(country);
    const visaTypes = Object.keys(SCENARIOS[country]) as VisaType<Country>[];
    const defaultVisa = visaTypes[0] || '';
    setSelectedVisaType(defaultVisa);
    setFormJson(SCENARIOS[country]?.[defaultVisa] || null);
    setGeneratedLink(null);
  };

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaType = e.target.value;
    setSelectedVisaType(visaType);
    if (selectedCountry) {
      setFormJson(
        SCENARIOS[selectedCountry]?.[
          visaType as keyof typeof SCENARIOS[typeof selectedCountry]
        ] || null
      );
    }
    setGeneratedLink(null);
  };

  const handleGenerate = async () => {
    if (!formJson) return;

    setIsLoading(true);
    setGeneratedLink(null);

    try {
      const res = await fetch('/api/create-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formJson),
      });

      const data = await res.json();

      if (data.success && data.link) {
        setGeneratedLink(data.link);
      } else {
        console.error('Ошибка генерации формы:', data.error);
      }
    } catch (err) {
      console.error('Серверная ошибка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/карта_фон.svg')]">
      <div className="bg-white p-8 rounded-xl shadow-xl animate-fade-in">
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
                Object.keys(SCENARIOS[selectedCountry]).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          <button
            className={`w-full py-2 rounded mt-4 font-semibold ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={handleGenerate}
            disabled={!formJson || isLoading}
          >
            {isLoading ? 'Создаём форму...' : 'Создать форму'}
          </button>

          {generatedLink && (
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Перейти к форме →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
