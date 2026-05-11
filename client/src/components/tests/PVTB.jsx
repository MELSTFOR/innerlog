import { useState, useEffect, useRef } from 'react';
import useTests from '../../hooks/useTests';

export default function PVTBTest({ onComplete, testDate }) {
  const [phase, setPhase] = useState('ready'); // ready, waiting, stimulus, finished
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [stimulus, setStimulus] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lapses, setLapses] = useState(0); // RT > 500ms
  const [anticipations, setAntipations] = useState(0); // RT < 100ms
  const [results, setResults] = useState(null);
  const { createTest } = useTests();

  const timerRef = useRef(null);
  const stimulusTimeRef = useRef(null);
  const waitIntervalRef = useRef(null);
  const isActiveRef = useRef(false);

  const startTest = () => {
    setPhase('waiting');
    isActiveRef.current = true;
    setReactionTimes([]);
    setLapses(0);
    setAntipations(0);
    setTimeLeft(300);
    scheduleStimulus();
    startTimer();
  };

  const scheduleStimulus = () => {
    const delay = Math.random() * 8000 + 2000; // 2-10 segundos
    waitIntervalRef.current = setTimeout(() => {
      if (isActiveRef.current && phase !== 'finished') {
        showStimulus();
      }
    }, delay);
  };

  const showStimulus = () => {
    setPhase('stimulus');
    setStimulus(true);
    stimulusTimeRef.current = Date.now();

    // Timeout: si no responde en 2 segundos, cuenta como lapse
    const timeoutId = setTimeout(() => {
      if (phase === 'stimulus') {
        setLapses((prev) => prev + 1);
        scheduleNextStimulus();
      }
    }, 2000);

    return timeoutId;
  };

  const handleResponse = () => {
    if (phase !== 'stimulus') return;

    const rt = Date.now() - stimulusTimeRef.current;
    setReactionTimes((prev) => [...prev, rt]);

    if (rt > 500) {
      setLapses((prev) => prev + 1);
    }
    if (rt < 100) {
      setAntipations((prev) => prev + 1);
    }

    setPhase('waiting');
    setStimulus(null);
    scheduleNextStimulus();
  };

  const scheduleNextStimulus = () => {
    if (isActiveRef.current && timeLeft > 0) {
      const delay = Math.random() * 8000 + 2000;
      waitIntervalRef.current = setTimeout(showStimulus, delay);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishTest = async () => {
    isActiveRef.current = false;
    setPhase('finished');
    clearInterval(timerRef.current);
    clearTimeout(waitIntervalRef.current);

    const trMedio = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length)
      : 0;
    const trMin = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
    const trMax = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0;

    const interpretation = trMedio < 250
      ? 'Excelente'
      : trMedio < 350
      ? 'Muy bueno'
      : trMedio < 450
      ? 'Bueno'
      : trMedio < 600
      ? 'Regular'
      : 'Bajo';

    const testResults = {
      trMedio,
      trMin,
      trMax,
      lapses,
      anticipations,
      stimulusCount: reactionTimes.length,
      interpretation,
    };

    setResults(testResults);

    // Guardar en backend
    await createTest({
      tipo_test: 'pvt-b',
      precision: 100,
      tr_medio: trMedio,
      tr_min: trMin,
      tr_max: trMax,
      lapses,
      anticipaciones: anticipations,
      duracion: 300,
      fecha: testDate,
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(waitIntervalRef.current);
    };
  }, []);

  if (results) {
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4 mt-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#00d4ff' }}>
            Resultados - PVT-B
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }}>Tiempo Promedio de Reacción</p>
              <p className="text-3xl font-bold" style={{ color: '#00d4ff' }}>
                {results.trMedio} ms
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p style={{ color: '#8b92a4' }}>TR Mínimo</p>
                <p className="text-2xl font-bold" style={{ color: '#58a6ff' }}>
                  {results.trMin} ms
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p style={{ color: '#8b92a4' }}>TR Máximo</p>
                <p className="text-2xl font-bold" style={{ color: '#a371f7' }}>
                  {results.trMax} ms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p style={{ color: '#8b92a4' }}>Lapses (RT &gt; 500ms)</p>
                <p className="text-2xl font-bold" style={{ color: '#ff6b6b' }}>
                  {results.lapses}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p style={{ color: '#8b92a4' }}>Anticipaciones (RT &lt; 100ms)</p>
                <p className="text-2xl font-bold" style={{ color: '#ffd93d' }}>
                  {results.anticipations}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#1a1f2e', borderColor: '#00d4ff' }}>
              <p style={{ color: '#8b92a4' }}>Evaluación</p>
              <p className="text-2xl font-bold" style={{ color: '#00d4ff' }}>
                {results.interpretation}
              </p>
            </div>

            <p style={{ color: '#8b92a4' }} className="text-sm">
              Estímulos respondidos: {results.stimulusCount}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setResults(null);
                  setPhase('ready');
                }}
                className="flex-1 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: '#30363d',
                  color: '#c9d1d9',
                }}
              >
                Intentar de Nuevo
              </button>
              <button
                onClick={onComplete}
                className="flex-1 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: '#00d4ff',
                  color: '#0f1117',
                }}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#00d4ff' }}>
            PVT-B (Psychomotor Vigilance Task)
          </h2>
          <p style={{ color: '#8b92a4' }} className="mb-4">
            Presiona el botón tan rápido como puedas cuando aparezca el estímulo.
            Tienes 5 minutos. {reactionTimes.length > 0 && `Estímulos: ${reactionTimes.length}`}
          </p>

          {phase === 'ready' && (
            <button
              onClick={startTest}
              className="w-full py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: '#00d4ff',
                color: '#0f1117',
              }}
            >
              Comenzar Test
            </button>
          )}
        </div>

        {phase !== 'ready' && (
          <div>
            <div className="mb-8 text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: '#00d4ff' }}>
                {timeLeft}s
              </div>
            </div>

            {phase === 'stimulus' && stimulus ? (
              <div className="mb-8">
                <div
                  className="text-center py-32 rounded-lg mb-8"
                  style={{
                    backgroundColor: '#ff6b6b',
                  }}
                >
                  <span className="text-7xl">●</span>
                </div>
                <button
                  onClick={handleResponse}
                  className="w-full py-6 rounded-lg font-semibold text-xl"
                  style={{
                    backgroundColor: '#00d4ff',
                    color: '#0f1117',
                  }}
                >
                  PRESIONAR
                </button>
              </div>
            ) : (
              <div>
                <div
                  className="text-center py-32 rounded-lg mb-8"
                  style={{
                    backgroundColor: '#1a1f2e',
                  }}
                >
                  <span className="text-2xl" style={{ color: '#8b92a4' }}>
                    Esperando estímulo...
                  </span>
                </div>
                <button
                  onClick={handleResponse}
                  disabled
                  className="w-full py-6 rounded-lg font-semibold text-xl opacity-50"
                  style={{
                    backgroundColor: '#30363d',
                    color: '#8b92a4',
                  }}
                >
                  PRESIONAR
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
