import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import StroopTest from '../components/tests/Stroop';
import PVTBTest from '../components/tests/PVTB';
import MSITTest from '../components/tests/MSIT';
import { PaintBrushIcon, LightBulbIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const tests = [
    {
      id: 'stroop',
      nombre: 'Test Stroop',
      descripcion: 'Identifica el color de la tinta de la palabra',
      duracion: '60 seg',
      Icon: PaintBrushIcon,
    },
    {
      id: 'pvt-b',
      nombre: 'PVT-B',
      descripcion: 'Mide tu tiempo de reacción ante estímulos visuales',
      duracion: '5 min',
      Icon: BoltIcon,
    },
    {
      id: 'msit',
      nombre: 'MSIT',
      descripcion: 'Prueba de interferencia y control cognitivo',
      duracion: '3-5 min',
      Icon: LightBulbIcon,
    },
  ];

  const renderTest = () => {
    switch (selectedTest) {
      case 'stroop':
        return <StroopTest onComplete={() => setSelectedTest(null)} testDate={selectedDate} />;
      case 'pvt-b':
        return <PVTBTest onComplete={() => setSelectedTest(null)} testDate={selectedDate} />;
      case 'msit':
        return <MSITTest onComplete={() => setSelectedTest(null)} testDate={selectedDate} />;
      default:
        return null;
    }
  };

  const handleTestSelect = (testId) => {
    setShowDatePicker(true);
    setSelectedTest(testId);
  };

  const handleStartTest = () => {
    setShowDatePicker(false);
  };

  if (selectedTest && showDatePicker) {
    const testName = tests.find(t => t.id === selectedTest)?.nombre || 'Test';
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6 mt-6" style={{ color: '#00d4ff' }}>
            {testName}
          </h2>
          <p className="mb-6" style={{ color: '#8b92a4' }}>
            Selecciona la fecha para este test
          </p>

          <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#1a1f2e' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#c9d1d9' }}>
              Fecha del Test
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: '#0f1117',
                borderColor: '#30363d',
                color: '#c9d1d9',
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedTest(null);
                setShowDatePicker(false);
              }}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: '#30363d',
                color: '#c9d1d9',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleStartTest}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: '#00d4ff',
                color: '#0f1117',
              }}
            >
              Comenzar Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTest) {
    return renderTest();
  }

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 mt-6" style={{ color: '#00d4ff' }}>
          Tests Cognitivos
        </h1>
        <p className="mb-8" style={{ color: '#8b92a4' }}>
          Evalúa tu rendimiento cognitivo
        </p>

        <div className="space-y-4">
          {tests.map((test) => {
            const Icon = test.Icon;
            return (
              <button
                key={test.id}
                onClick={() => handleTestSelect(test.id)}
                className="w-full p-6 rounded-lg text-left transition hover:opacity-90 border"
                style={{
                  backgroundColor: '#1a1f2e',
                  borderColor: '#30363d',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      <h3 className="text-xl font-semibold" style={{ color: '#c9d1d9' }}>
                        {test.nombre}
                      </h3>
                    </div>
                    <p className="mb-2" style={{ color: '#8b92a4' }}>
                      {test.descripcion}
                    </p>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#30363d', color: '#8b92a4' }}>
                      {test.duracion}
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e', borderLeft: '3px solid #a371f7' }}>
          <p className="text-sm" style={{ color: '#8b92a4' }}>
            <strong style={{ color: '#c9d1d9' }}>Nota:</strong> Estos tests requieren concentración. Encuentra un lugar tranquilo y realiza los tests cuando estés bien descansado.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
