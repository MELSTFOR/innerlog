import { useState, useEffect, useRef } from 'react';
import useTests from '../../hooks/useTests';

export default function MSITTest({ onComplete, testDate }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  const [stimulus, setStimulus] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState(null);
  const { createTest } = useTests();

  const stimulusTimeRef = useRef(null);
  const startTimeRef = useRef(null);

  const generateStimulus = () => {
    const uniqueNum = Math.floor(Math.random() * 3) + 1;
    const repeatedNum = Math.floor(Math.random() * 3) + 1;
    while (uniqueNum === repeatedNum);

    const positions = [0, 1, 2];
    const uniquePos = Math.floor(Math.random() * 3);
    
    let numbers = [repeatedNum, repeatedNum, repeatedNum];
    numbers[uniquePos] = uniqueNum;

    const isCongruent = Math.random() > 0.5;
    
    return {
      numbers,
      uniqueNum,
      uniquePos,
      isCongruent,
    };
  };

  const startTest = () => {
    setIsActive(true);
    setCorrect(0);
    setTotal(0);
    setReactionTimes([]);
    setTimeLeft(180);
    startTimeRef.current = Date.now();
    showNextStimulus();
  };

  const showNextStimulus = () => {
    setStimulus(generateStimulus());
    stimulusTimeRef.current = Date.now();
  };

  const handleNumberClick = (index) => {
    if (!isActive || !stimulus) return;

    const rt = Date.now() - stimulusTimeRef.current;
    setReactionTimes((prev) => [...prev, rt]);
    setTotal((prev) => prev + 1);

    if (index === stimulus.uniquePos) {
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

    const interpretation = precision > 85 ? 'Control cognitivo excelente'
      : precision > 70 ? 'Control cognitivo bueno'
      : precision > 50 ? 'Control cognitivo regular'
      : 'Interferencia cognitiva alta';

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
      tipo_test: 'msit',
      precision: parseFloat(precision),
      tr_medio: parseInt(avgRt),
      tr_min: Math.min(...reactionTimes),
      tr_max: Math.max(...reactionTimes),
      duracion: 180,
      fecha: testDate,
    });
  };

  if (results) {
    return (
      <div className="pb-24" style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto p-4 mt-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#00d4ff' }}>
            Resultados - MSIT
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
              <p style={{ color: '#8b92a4' }}>Control Cognitivo</p>
              <p className="text-2xl font-bold" style={{ color: '#a371f7' }}>
                {results.interpretation}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setResults(null);
                  setStimulus(null);
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
            MSIT (Multi-Source Interference Task)
          </h2>
          <p style={{ color: '#8b92a4' }} className="mb-4">
            Presiona el número que es diferente de los otros dos. Tienes 3 minutos.
          </p>

          {!isActive && !stimulus && (
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

            {stimulus && (
              <div className="mb-8">
                <div
                  className="text-center py-12 rounded-lg mb-8"
                  style={{
                    backgroundColor: '#1a1f2e',
                  }}
                >
                  <div className="flex justify-around items-center px-8">
                    {stimulus.numbers.map((num, idx) => (
                      <div
                        key={idx}
                        className="text-5xl font-bold"
                        style={{
                          color: idx === stimulus.uniquePos ? '#ff6b6b' : '#c9d1d9',
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {stimulus.numbers.map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNumberClick(idx)}
                      className="py-4 rounded-lg font-semibold text-xl transition hover:opacity-80"
                      style={{
                        backgroundColor: idx === stimulus.uniquePos ? '#ff6b6b' : '#30363d',
                        color: idx === stimulus.uniquePos ? '#0f1117' : '#c9d1d9',
                      }}
                    >
                      {num}
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
