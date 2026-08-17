'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const PRESETS = [
  { key: 'v60', ratio: 16 },
  { key: 'chemex', ratio: 15 },
  { key: 'frenchPress', ratio: 15 },
  { key: 'aeropress', ratio: 14 },
  { key: 'coldBrew', ratio: 8 },
  { key: 'mokaPot', ratio: 10 },
  { key: 'espresso', ratio: 2 },
];

export default function BrewCalculatorPage() {
  const { t } = useLanguage();
  const [ratio, setRatio] = useState(16);
  const [mode, setMode] = useState<'coffee' | 'water'>('coffee');
  const [coffeeGrams, setCoffeeGrams] = useState(18);
  const [waterGrams, setWaterGrams] = useState(coffeeGrams * ratio);

  function onRatioChange(next: number) {
    setRatio(next);
    if (mode === 'coffee') setWaterGrams(Math.round(coffeeGrams * next));
    else setCoffeeGrams(Math.round((waterGrams / next) * 10) / 10);
  }

  function onCoffeeChange(next: number) {
    setCoffeeGrams(next);
    setWaterGrams(Math.round(next * ratio));
    setMode('coffee');
  }

  function onWaterChange(next: number) {
    setWaterGrams(next);
    setCoffeeGrams(Math.round((next / ratio) * 10) / 10);
    setMode('water');
  }

  return (
    <div className="container-page py-10">
      <p className="section-eyebrow">{t('calculator.eyebrow')}</p>
      <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">{t('calculator.title')}</h1>
      <p className="mt-2 max-w-xl text-sm text-espresso-500">{t('calculator.subtitle')}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card space-y-6 p-6 sm:p-8">
          <div>
            <label className="label">{t('calculator.brewMethod')}</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => onRatioChange(p.ratio)}
                  className={`badge border transition-colors ${
                    ratio === p.ratio ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 bg-white text-espresso-600 hover:bg-espresso-50'
                  }`}
                >
                  {t(`calculator.presets.${p.key}`)} (1:{p.ratio})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="ratio">{t('calculator.customRatio')}</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-espresso-600">1 :</span>
              <input
                id="ratio"
                type="number"
                min={1}
                max={30}
                step={0.5}
                className="input w-24"
                value={ratio}
                onChange={(e) => onRatioChange(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="coffee">{t('calculator.coffeeGrams')}</label>
              <input
                id="coffee"
                type="number"
                min={0}
                step={0.5}
                className="input"
                value={coffeeGrams}
                onChange={(e) => onCoffeeChange(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label" htmlFor="water">{t('calculator.waterGrams')}</label>
              <input
                id="water"
                type="number"
                min={0}
                step={1}
                className="input"
                value={waterGrams}
                onChange={(e) => onWaterChange(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <p className="text-xs text-espresso-400">{t('calculator.hint')}</p>
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-bold text-espresso-800">{t('calculator.resultTitle')}</h2>
          <div className="mt-4 space-y-2 text-sm text-espresso-600">
            <div className="flex justify-between">
              <span>{t('calculator.ratio')}</span>
              <span className="font-semibold text-espresso-800">1 : {ratio}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('calculator.coffeeGrams')}</span>
              <span className="font-semibold text-espresso-800">{coffeeGrams} g</span>
            </div>
            <div className="flex justify-between">
              <span>{t('calculator.waterGrams')}</span>
              <span className="font-semibold text-espresso-800">{waterGrams} g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
