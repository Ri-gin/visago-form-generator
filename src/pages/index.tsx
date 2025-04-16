import { useState } from 'react';
import { SCENARIOS } from '../components/scenarios';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [formJson, setFormJson] = useState<{ title: string; fields: any[] } | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);

    const visaTypes = Object.keys(SCENARIOS[country] || {});
    const defaultVisa = visaTypes[0] || '';
    setSelectedVisaType(defaultVisa);
    setFormJson(SCENARIOS[country]?.[defaultVisa] || null);
  };

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaType = e.target.value;
    setSelectedVisaType(visaType);
    if (selectedCountry && SCENARIOS[selectedCountry]) {
      setFormJson(SCENARIOS[selectedCountry][visaType] || null);
    }
  };

  const handleGenerate = async () => {
    if (!formJson) return;

    try {
      const res = await fetch('/api/create-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formJson),
      });

      const data = await res.json();
      if (data.success && data.link) {
        window.open(data.link, '_blank');
      } else {
        alert('Failed to generate form');
      }
    } catch {
      alert('Unexpected error');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/карта_фон.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 1s ease-in',
          minWidth: '300px',
        }}
      >
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
          <span role="img" aria-label="globe" style={{ marginRight: '10px' }}>
            🌍
          </span>
          Visago Auto Form
        </h1>

        <div style={{ marginTop: '20px' }}>
          <label>Country</label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select Country</option>
            {Object.keys(SCENARIOS).map((country) => (
              <option key={country} value={country}>
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div style={{ marginTop: '20px' }}>
            <label>Visa Type</label>
            <select
              value={selectedVisaType}
              onChange={handleVisaTypeChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Select Visa Type</option>
              {Object.keys(SCENARIOS[selectedCountry]).map((visaType) => (
                <option key={visaType} value={visaType}>
                  {visaType.charAt(0).toUpperCase() + visaType.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleGenerate}
          style={{
            width: '100%',
            marginTop: '30px',
            padding: '10px',
            backgroundColor: '#0057ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Создать форму
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
