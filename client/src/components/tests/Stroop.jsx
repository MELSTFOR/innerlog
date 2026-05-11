import { useState, useEffect, useRef } from 'react';
import useTests from '../../hooks/useTests';

const STROOP_COLORS = [
  { name: 'rojo', hex: '#ff6b6b' },
  { name: 'azul', hex: '#58a6ff' },
  { name: 'verde', hex: '#31eb96' },
  { name: 'amarillo', hex: '#ffd93d' },
  { name: 'morado', hex: '#a371f7' },
];

const STROOP_WORDS = ['rojo', 'azul', 'verde', 'amarillo', 'morado'];

export default function StroopTest({ onComplete, testDate }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const { createTest } = useTests();
  const startTimeRef = useRef(null);
  const stimulusTimeRef = useRef(null);

  const getRandomStimulus = () => {
    const textColorIdx = Math.floor(Math.random() * STROOP_COLORS.length);
    const wordIdx = Math.floor(Math.random() * STROOP_WORDS.length);
    return {
      textColor: STROOP_COLORS[textColorIdx],
      word: STROOP_WORDS[wordIdx],
      correctIdx: textColorIdx,
    };
  };

  const startTest = () => {
    setIsActive(true);
    setCorrect(0);
    setTotal(0);
    setReactionTimes([]);
    setTimeLeft(60);
    startTimeRef.current = Date.now();
    showNextStimulus();
  };

  const showNextStimulus = () => {
    setCurrentStimulus(getRandomStimulus());
    stimulusTimeRef.current = Date.now();
  };

  const handleColorClick = (colorIdx) => {
    if (!isActive || !currentStimulus) return;

    const rt = Date.now() - stimulusTimeRef.current;
    setReactionTimes((prev) => [...prev, rt]);
    setTotal((prev) => prev + 1);

    if (colorIdx === currentStimulus.correctIdx) {
      setCorrect((prev) => prev + 1);
    }

    showNextStimulus();
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const finishTest = async () => {
    setIsActive(false);

    const precision = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;
    const avgRt = reactionTimes.length > 0
      ? (reactionTimes.reduce((a, b) => a + b) / reactionTimes.length).toFixed(0)
      : 0;

    const interpretation = avgRt < 400 ? 'Muy alta' : avgRt < 600 ? 'Alta' : avgRt < 800 ? 'Media' : 'Baja';

    const testResults = {
      precision: parseFloat(precision),
      avgRt,
      correct,
      total,
      interpretation,
    };

    setResults(testResults);

    // Guardar en backend
    await createTest({
      tipo_test: 'stroop',
      precision: parseFloat(precision),
      tr_medio: parseInt(avgRt),
      tr_min: Math.min(...reactionTimes),
      tr_max: Math.max(...reactionTimes),
      duracion: 60,
      fecha: testDate,
    });
  };

  if (results) {
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4 mt-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#00d4ff' }}>
            Resultados - Test Stroop
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }}>Precisión</p>
              <p className="text-3xl font-bold" style={{ color: '#00d4ff' }}>
                {results.precision}%
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }}>Tiempo Promedio de Reacción</p>
              <p className="text-3xl font-bold" style={{ color: '#58a6ff' }}>
                {results.avgRt} ms
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
              <p style={{ color: '#8b92a4' }}>Respuestas Correctas</p>
              <p className="text-3xl font-bold" style={{ color: '#31eb96' }}>
                {results.correct}/{results.total}
              </p>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#1a1f2e', borderColor: '#a371f7' }}>
              <p style={{ color: '#8b92a4' }}>Carga Cognitiva</p>
              <p className="text-2xl font-bold" style={{ color: '#a371f7' }}>
                {results.interpretation}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setResults(null);
                  setCurrentStimulus(null);
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
            Test Stroop
          </h2>
          <p style={{ color: '#8b92a4' }} className="mb-4">
            Identifica el color de la tinta (no la palabra). Tienes 60 segundos.
          </p>

          {!isActive && !currentStimulus && (
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

        {isActive && (
          <div>
            <div className="mb-8 text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: '#00d4ff' }}>
                {timeLeft}s
              </div>
              <p style={{ color: '#8b92a4' }}>
                Correctas: {correct} / Total: {total}
              </p>
            </div>

            {currentStimulus && (
              <div className="mb-8">
                <div
                  className="text-7xl font-bold text-center mb-8 py-8 rounded-lg"
                  style={{
                    color: currentStimulus.textColor.hex,
                    backgroundColor: '#1a1f2e',
                  }}
                >
                  {currentStimulus.word}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {STROOP_COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorClick(idx)}
                      className="py-3 rounded-lg font-semibold transition hover:opacity-80"
                      style={{
                        backgroundColor: color.hex,
                        color: '#0f1117',
                      }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
