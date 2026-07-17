import React, { useRef, useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useAreaCalculator } from '../hooks/useAreaCalculator';
import { CategorySelector } from '../components/CategorySelector';
import { MeasurementForm } from '../components/MeasurementForm';
import { DeductionForm } from '../components/DeductionForm';
import { WastageSelector } from '../components/WastageSelector';
import { ProductCoverageForm } from '../components/ProductCoverageForm';
import { CostEstimator } from '../components/CostEstimator';
import { CalculationResults } from '../components/CalculationResults';
import { LiveCalculationSummary } from '../components/LiveCalculationSummary';
import { CoverageVisualizer } from '../components/CoverageVisualizer';
import {
  HelpCircle,
  Info,
  Calculator,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Sparkles,
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const {
    state,
    errors,
    results,
    changeCategory,
    changeMeasurementType,
    changeUnit,
    addRow,
    duplicateRow,
    sameSizeAsPrevious,
    removeRow,
    updateRow,
    updateRowLabel,
    addDeduction,
    removeDeduction,
    updateDeduction,
    updateDeductionLabel,
    updateWastage,
    updateProductCoverage,
    updateCharges,
    updateActiveWallIndex,
    resetCalculator,
    validateForm,
  } = useAreaCalculator();

  const [activeStep, setActiveStep] = useState<number>(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const STEPS = [
    { num: 1, label: 'Category' },
    { num: 2, label: 'Measurements' },
    { num: 3, label: 'Product & Pricing' },
    { num: 4, label: 'Visual Coverage' },
    { num: 5, label: 'Estimate' },
  ];

  const handleRecalculate = () => {
    const isValid = validateForm();
    if (isValid) {
      setActiveStep(5);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const hasMeasurementError = errorKeys.some(k => k.startsWith('row') || k.startsWith('ded'));
        if (hasMeasurementError) {
          setActiveStep(2);
        } else {
          setActiveStep(3);
        }
      }
    }
  };

  const handleReset = () => {
    resetCalculator();
    setActiveStep(1);
  };

  const handleStepClick = (stepNum: number) => {
    if (stepNum === 1) {
      setActiveStep(1);
    } else if (stepNum === 2) {
      setActiveStep(2);
    } else if (stepNum === 3) {
      if (validateForm()) setActiveStep(3);
    } else if (stepNum === 4) {
      if (validateForm()) setActiveStep(4);
    } else if (stepNum === 5) {
      if (validateForm()) setActiveStep(5);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 sm:pb-36 font-sans print:p-0 print:m-0" id="calc-page-container">
      {/* Print-Only CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #calc-page-container, #calc-page-container * {
            visibility: visible;
          }
          #calc-page-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          header, footer, nav, button, .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Breadcrumb - Hidden on Print */}
      <div className="print:hidden">
        <Breadcrumb items={[{ label: 'Area & Cost Calculator' }]} />
      </div>

      {/* Hero Banner */}
      <div className="border-b border-brand-navy/10 pb-6 mb-8 mt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-brand-orange uppercase tracking-wider print:hidden">
            <Calculator className="h-4.5 w-4.5 animate-pulse" /> Estimation Engine
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-brand-navy mt-1.5">
            Interior Area & Cost Calculator
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-2 max-w-2xl leading-relaxed font-light">
            Professional quantity, placement planning, and real-time installer fee planner for Premium Wallpaper, Panels, Glass Film, Blinds, and Flooring.
          </p>
        </div>
        
        {/* Quick Reset or Print buttons */}
        <div className="flex gap-2 print:hidden shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-ivory text-brand-navy rounded-lg border border-brand-navy/10 hover:bg-brand-navy/5 cursor-pointer transition-all active:scale-95"
          >
            Reset All
          </button>
          {activeStep === 5 && (
            <button
              type="button"
              onClick={triggerPrint}
              className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-navy text-white rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-brand-navy/95 transition-all active:scale-95 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" /> Print Estimate
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper - Hidden on Print */}
      <div className="bg-brand-ivory/60 rounded-2xl border border-brand-navy/5 p-3 sm:p-4 mb-6 shadow-xs print:hidden">
        <div className="flex items-center justify-between sm:justify-around gap-1">
          {STEPS.map((step) => {
            const isCompleted = step.num < activeStep;
            const isActive = step.num === activeStep;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => handleStepClick(step.num)}
                className={`flex items-center gap-2 text-left cursor-pointer transition-all duration-200 outline-none select-none ${
                  isActive
                    ? 'opacity-100 scale-102 font-extrabold'
                    : isCompleted
                    ? 'opacity-90 text-brand-orange'
                    : 'opacity-45'
                }`}
              >
                <div
                  className={`h-6.5 w-6.5 sm:h-7.5 sm:w-7.5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white ring-4 ring-brand-orange/25'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-brand-navy/10 text-brand-navy'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                
                {/* Desktop Labels */}
                <div className="hidden md:block">
                  <span className="text-[8px] text-brand-secondary block leading-none font-extrabold uppercase tracking-wider">
                    Step 0{step.num}
                  </span>
                  <span className="text-[11px] font-extrabold text-brand-navy block mt-0.5">
                    {step.label}
                  </span>
                </div>

                {/* Mobile Active Label Only */}
                {isActive && (
                  <div className="md:hidden block">
                    <span className="text-[8px] text-brand-secondary block leading-none font-extrabold uppercase tracking-wider">
                      Active Step {step.num}/5
                    </span>
                    <span className="text-[10px] font-black text-brand-navy block mt-0.5">
                      {step.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Errors banner */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 shadow-xs print:hidden">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Please correct the highlighted inputs to proceed:</p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1 font-medium text-[11px]">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Grid Layout of the page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form blocks */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Category Selection */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in" id="step-block-category">
              <CategorySelector selected={state.category} onChange={(cat) => { changeCategory(cat); setActiveStep(2); }} />
              
              <div className="flex justify-end pt-4 border-t border-brand-navy/5 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-98 shadow-md"
                >
                  Configure Measurements <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Measurements */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-fade-in" id="step-block-measurements">
              <MeasurementForm
                category={state.category}
                measurementType={state.measurementType}
                unit={state.unit}
                rows={state.rows}
                errors={errors}
                onTypeChange={changeMeasurementType}
                onUnitChange={changeUnit}
                onAddRow={addRow}
                onRemoveRow={removeRow}
                onUpdateRow={updateRow}
                onUpdateRowLabel={updateRowLabel}
                onDuplicateRow={duplicateRow}
                onSameSizeAsPrevious={sameSizeAsPrevious}
              />

              {/* Deductions - Only for Wallpapers, Wall Panels, Glass Films */}
              {['Wallpapers', 'Wall Panels', 'Glass Films'].includes(state.category) && (
                <DeductionForm
                  category={state.category}
                  unit={state.unit}
                  deductions={state.deductions}
                  errors={errors}
                  onAddDeduction={addDeduction}
                  onRemoveDeduction={removeDeduction}
                  onUpdateDeduction={updateDeduction}
                  onUpdateDeductionLabel={updateDeductionLabel}
                />
              )}

              <WastageSelector
                category={state.category}
                wastage={state.wastage}
                errors={errors}
                onWastageChange={updateWastage}
              />

              {/* Inline mobile view components */}
              <div className="lg:hidden space-y-4 print:hidden">
                <LiveCalculationSummary category={state.category} results={results} wastage={state.wastage} />
              </div>

              <div className="flex justify-between pt-4 border-t border-brand-navy/5 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4.5 py-2.5 bg-brand-ivory text-brand-navy font-bold text-xs rounded-xl hover:bg-brand-navy/5 cursor-pointer transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) setActiveStep(3);
                  }}
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-98 shadow-md"
                >
                  Define Pricing specs <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Product Specs & Pricing */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-fade-in" id="step-block-products">
              <ProductCoverageForm
                category={state.category}
                coverage={state.productCoverage}
                errors={errors}
                onChange={updateProductCoverage}
              />

              <CostEstimator
                transport={state.transportCharge}
                additional={state.additionalCharge}
                onChange={updateCharges}
              />

              {/* Inline mobile view components */}
              <div className="lg:hidden space-y-4 print:hidden">
                <LiveCalculationSummary category={state.category} results={results} wastage={state.wastage} />
              </div>

              <div className="flex justify-between pt-4 border-t border-brand-navy/5 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4.5 py-2.5 bg-brand-ivory text-brand-navy font-bold text-xs rounded-xl hover:bg-brand-navy/5 cursor-pointer transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) setActiveStep(4);
                  }}
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-md"
                >
                  Preview Layout <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Visual Coverage */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-fade-in" id="step-block-coverage-visualizer">
              <CoverageVisualizer
                state={state}
                results={results}
                onChange={updateProductCoverage}
                updateActiveWallIndex={updateActiveWallIndex}
              />

              <div className="flex justify-between pt-4 border-t border-brand-navy/5 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4.5 py-2.5 bg-brand-ivory text-brand-navy font-bold text-xs rounded-xl hover:bg-brand-navy/5 cursor-pointer transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) setActiveStep(5);
                  }}
                  className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-md"
                >
                  Generate Quotation <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Final Estimate Bill */}
          {activeStep === 5 && (
            <div className="space-y-5 animate-fade-in" id="step-block-estimate">
              <CalculationResults
                state={state}
                results={results}
                onReset={handleReset}
                onRecalculate={handleRecalculate}
              />

              {/* Inline mobile view visualizer for Step 5 */}
              <div className="lg:hidden space-y-4 print:hidden">
                <CoverageVisualizer
                  state={state}
                  results={results}
                  onChange={updateProductCoverage}
                  updateActiveWallIndex={updateActiveWallIndex}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-brand-navy/5 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 bg-brand-ivory text-brand-navy font-bold text-xs rounded-xl hover:bg-brand-navy/5 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Modify Layout
                </button>
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Summary Sidebar Panel */}
        <div className="hidden lg:block lg:col-span-5 space-y-4 sticky top-24 print:hidden" ref={resultsRef}>
          {activeStep < 5 ? (
            /* Steps 1-4 show real-time metrics */
            <LiveCalculationSummary category={state.category} results={results} wastage={state.wastage} />
          ) : (
            /* Step 5 shows a mini visualizer panel for instant review alongside the bill */
            <div className="bg-brand-ivory/20 rounded-2xl border border-brand-navy/5 p-4 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange block">
                Visualizer Layout Recap
              </span>
              <CoverageVisualizer
                state={state}
                results={results}
                onChange={updateProductCoverage}
                updateActiveWallIndex={updateActiveWallIndex}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
