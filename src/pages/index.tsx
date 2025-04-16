import { useEffect, useState } from 'react';
import { SCENARIOS } from '../components/scenarios';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [formJson, setFormJson] = useState<any>(null);
  const [formLink, setFormLink] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false); // для анимации

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 100); // небольшая задержка для smooth-эффекта
    return () => clearTimeout(timeout);
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedVisaType('');
    setFormJson(null);
    setFormLink('');
  };

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaType = e.target.value;
    setSelectedVisaType(visaType);
    if (selectedCountry && SCENARIOS[selectedCountry]?.[visaType]) {
      setFormJson(SCENARIOS[selectedCountry][visaType]);
    } else {
      setFormJson(null);
    }
    setFormLink('');
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
      if (data.success) {
        window.open(data.link, '_blank');
        setFormLink(data.link);
      } else {
        setError('Ошибка генерации формы');
      }
    } catch (err) {
      setError('Не удалось создать форму');
    }
  };

  const countries = Object.keys(SCENARIOS);
  const visaTypes = selectedCountry ? Object.keys(SCENARIOS[selectedCountry]) : [];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/карта_фон.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '30px',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>
            <span role="img" aria-label="globe">
              🌍
            </span>{' '}
            Visago Auto Form
          </h2>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Country</label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country[0].toUpperCase() + country.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Visa Type</label>
          <select
            value={selectedVisaType}
            onChange={handleVisaTypeChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            disabled={!selectedCountry}
          >
            <option value="">Select Visa Type</option>
            {visaTypes.map((type) => (
              <option key={type} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!formJson}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0066ff',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Создать форму
        </button>

        {error && (
          <div style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{error}</div>
        )}
      </div>
    </div>
  );
}
