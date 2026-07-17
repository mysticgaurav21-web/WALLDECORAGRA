import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { formatCurrency, convertSqFtToSqM } from '../utils/unitConversions';
import {
  RefreshCw,
  RotateCcw,
  PlusCircle,
  MessageSquare,
  Calendar,
  Info,
  CheckCircle2,
  Receipt,
} from 'lucide-react';

interface CalculationResultsProps {
  state: CalculatorState;
  results: CalculationResult;
  onReset: () => void;
  onRecalculate: () => void;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({
  state,
  results,
  onReset,
  onRecalculate,
}) => {
  const navigate = useNavigate();
  const { addToBasket } = useApp();
  const [addedToEnquiry, setAddedToEnquiry] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState('919999999999');

  const {
    category,
    measurementType,
    unit,
    wastage,
    productCoverage,
    transportCharge,
    additionalCharge,
  } = state;

  const {
    totalAreaSqFt,
    totalAreaSqM,
    totalDeductionSqFt,
    netAreaSqFt,
    wastageAreaSqFt,
    finalRequiredCoverageSqFt,
    estimatedQuantity,
    roundedQuantity,
    materialCost,
    installationCost,
    grandTotal,
  } = results;

  const getWhatsAppMessage = () => {
    let msg = `*WallDecor99 - Interior Estimation*\n\n`;
    msg += `*Category:* ${category}\n`;
    msg += `*Setup:* ${measurementType} (${state.rows.length} area(s))\n`;
    msg += `*Dimensions Unit:* ${unit}\n`;
    msg += `*Total Measured Area:* ${totalAreaSqFt.toFixed(1)} sq ft (${totalAreaSqM.toFixed(1)} sq m)\n`;
    
    if (category === 'Wallpapers' || category === 'Wall Panels') {
      msg += `*Deductions (doors/windows):* ${totalDeductionSqFt.toFixed(1)} sq ft\n`;
      msg += `*Net Wall Area:* ${netAreaSqFt.toFixed(1)} sq ft\n`;
    }
    
    msg += `*Wastage Factor:* ${wastage}%\n`;
    msg += `*Final Required Coverage:* ${finalRequiredCoverageSqFt.toFixed(1)} sq ft\n\n`;
    
    msg += `*Selected Product:* ${productCoverage.productName || 'Custom Spec'}\n`;
    if (productCoverage.productCode) msg += `*Code:* ${productCoverage.productCode}\n`;
    msg += `*Product Coverage:* ${productCoverage.coveragePerUnit} sq ft / ${productCoverage.unit}\n`;
    msg += `*Required Quantity:* ${estimatedQuantity.toFixed(2)} ${productCoverage.unit}(s)\n`;
    msg += `*Purchase Quantity:* *${roundedQuantity}* ${productCoverage.unit}(s)\n\n`;
    
    msg += `*Material Cost:* ${formatCurrency(materialCost)}\n`;
    msg += `*Installation Cost:* ${formatCurrency(installationCost)}\n`;
    if (transportCharge > 0) msg += `*Transport/Delivery:* ${formatCurrency(transportCharge)}\n`;
    if (additionalCharge > 0) msg += `*Additional Charges:* ${formatCurrency(additionalCharge)}\n`;
    
    msg += `*Approximate Grand Total:* *${formatCurrency(grandTotal)}*\n\n`;
    msg += ` _Note: This is an approximate estimate. Please confirm with WallDecor99 for final site measurement._`;
    
    return encodeURIComponent(msg);
  };

  const handleWhatsAppClick = () => {
    const formattedNum = whatsappNum.replace(/\D/g, '');
    const cleanNum = formattedNum.startsWith('91') ? formattedNum : `91${formattedNum}`;
    const url = `https://wa.me/${cleanNum}?text=${getWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  const handleAddResultToEnquiry = () => {
    const summaryText = `Calculator Estimate for ${category}:\n- Total Area: ${totalAreaSqFt.toFixed(1)} sq ft\n- Product: ${productCoverage.productName || 'Custom Product'} (Qty: ${roundedQuantity} ${productCoverage.unit}s)\n- Material Cost: ${formatCurrency(materialCost)}\n- Installation Cost: ${formatCurrency(installationCost)}\n- Estimated Grand Total: ${formatCurrency(grandTotal)}`;
    const areaText = `${totalAreaSqFt.toFixed(0)} sq ft (${roundedQuantity} ${productCoverage.unit}s)`;
    
    localStorage.setItem('wd99_calc_summary', summaryText);
    localStorage.setItem('wd99_calc_area', areaText);

    const virtualProduct = {
      id: `calc-${Date.now()}`,
      mainProduct: category,
      category: category,
      subcategory: measurementType,
      productName: productCoverage.productName || `${category} Estimate`,
      productCode: productCoverage.productCode || 'CALC-EST',
      material: 'Custom Spec',
      colour: 'Custom Spec',
      size: `${productCoverage.coveragePerUnit} sq.ft / ${productCoverage.unit}`,
      finish: 'Standard',
      unit: productCoverage.unit,
      sellingPrice: productCoverage.sellingPrice,
      installationCharge: productCoverage.installationCharge,
      stockQuantity: 999,
      images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'],
      roomPreviewImages: [],
      description: `Approximate estimation done on our calculator. Net area: ${netAreaSqFt.toFixed(1)} sq ft, required quantity: ${roundedQuantity} ${productCoverage.unit}s.`,
      suitableFor: ['Residential', 'Commercial'],
      featured: false,
      active: true,
    };

    addToBasket(virtualProduct, roundedQuantity || 1);
    setAddedToEnquiry(true);

    setTimeout(() => {
      navigate('/enquiry');
    }, 1200);
  };

  const handleBookVisitClick = () => {
    navigate('/consultation', {
      state: {
        category,
        estimatedArea: `${totalAreaSqFt.toFixed(0)} sq ft`,
        message: `I calculated an area of ${totalAreaSqFt.toFixed(1)} sq ft for ${category} using the Cost Calculator and would like a free site measurement & physical catalogue presentation.`,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-navy p-4 sm:p-5 shadow-md space-y-5" id="calc-results-card">
      {/* High Contrast Navy Header */}
      <div className="border-b border-brand-navy/10 pb-3">
        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
          Final Estimator Bill
        </span>
        <h3 className="font-display text-sm font-black text-brand-navy flex items-center gap-1.5">
          <Receipt className="h-4.5 w-4.5 text-brand-orange" /> Quotation Details
        </h3>
      </div>

      {/* Sizing & Material Quantity Card */}
      <div className="bg-brand-ivory/50 rounded-xl border border-brand-navy/5 p-3.5 space-y-2.5 text-xs">
        <h4 className="font-bold text-brand-navy text-[11px] uppercase tracking-wider mb-1">
          Material & Coverage Specifications
        </h4>
        
        <div className="flex justify-between border-b border-brand-navy/5 pb-1.5">
          <span className="text-brand-secondary">Gross Measured Area:</span>
          <span className="font-bold text-brand-navy font-mono">
            {totalAreaSqFt.toFixed(1)} sq.ft{' '}
            <span className="text-[10px] font-normal text-brand-secondary font-sans">({totalAreaSqM.toFixed(1)} sq.m)</span>
          </span>
        </div>

        {(category === 'Wallpapers' || category === 'Wall Panels') && (
          <div className="flex justify-between border-b border-brand-navy/5 pb-1.5">
            <span className="text-brand-secondary">Deducted Openings Area:</span>
            <span className="font-bold text-red-500 font-mono">
              -{totalDeductionSqFt.toFixed(1)} sq.ft
            </span>
          </div>
        )}

        {(category === 'Wallpapers' || category === 'Wall Panels') && (
          <div className="flex justify-between border-b border-brand-navy/5 pb-1.5 bg-white/60 px-2 py-0.5 rounded border border-brand-navy/5">
            <span className="font-semibold text-brand-navy">Net Working Area:</span>
            <span className="font-extrabold text-brand-navy font-mono">
              {netAreaSqFt.toFixed(1)} sq.ft
            </span>
          </div>
        )}

        <div className="flex justify-between border-b border-brand-navy/5 pb-1.5">
          <span className="text-brand-secondary">Wastage Buffer ({wastage}%):</span>
          <span className="font-semibold text-brand-navy font-mono">
            +{wastageAreaSqFt.toFixed(1)} sq.ft
          </span>
        </div>

        <div className="flex justify-between border-b border-brand-navy/5 pb-1.5">
          <span className="font-bold text-brand-navy">Final Net Required Coverage:</span>
          <span className="font-black text-brand-navy font-mono">
            {finalRequiredCoverageSqFt.toFixed(1)} sq.ft
          </span>
        </div>

        <div className="flex justify-between pt-1 font-bold text-brand-navy">
          <span>Rounded Purchase Quantity:</span>
          <span className="text-xs font-black text-brand-orange font-mono uppercase">
            {roundedQuantity} {productCoverage.unit}(s)
          </span>
        </div>
      </div>

      {/* Itemized Billing Breakdown Table */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-brand-navy text-[11px] uppercase tracking-wider">
          Itemized Cost Breakdown
        </h4>
        <div className="overflow-x-auto rounded-xl border border-brand-navy/10">
          <table className="w-full text-left text-[11px] font-medium text-brand-navy">
            <thead className="bg-brand-navy text-white text-[9px] uppercase tracking-wider">
              <tr>
                <th className="px-2.5 py-2">Item Description</th>
                <th className="px-2 py-2 text-center">Qty / Area</th>
                <th className="px-2 py-2 text-right">Rate</th>
                <th className="px-2.5 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              <tr>
                <td className="px-2.5 py-2">
                  <p className="font-bold text-brand-navy max-w-[130px] truncate" title={productCoverage.productName}>
                    {productCoverage.productName || 'Custom Spec'}
                  </p>
                  <p className="text-[9px] text-brand-secondary">
                    {productCoverage.productCode || 'CALC-EST'}
                  </p>
                </td>
                <td className="px-2 py-2 text-center font-mono text-[10px]">
                  {roundedQuantity} {productCoverage.unit}(s)
                </td>
                <td className="px-2 py-2 text-right font-mono text-[10px]">
                  ₹{productCoverage.sellingPrice.toFixed(0)}
                </td>
                <td className="px-2.5 py-2 text-right font-bold font-mono text-brand-navy">
                  {formatCurrency(materialCost)}
                </td>
              </tr>
              <tr>
                <td className="px-2.5 py-2">
                  <p className="font-bold text-brand-navy">Labour / Installation</p>
                  <p className="text-[9px] text-brand-secondary">Professional fitting</p>
                </td>
                <td className="px-2 py-2 text-center font-mono text-[10px]">
                  {productCoverage.isInstallationPerUnit
                    ? `${roundedQuantity} unit(s)`
                    : `${netAreaSqFt.toFixed(0)} sqft`}
                </td>
                <td className="px-2 py-2 text-right font-mono text-[10px]">
                  ₹{productCoverage.installationCharge.toFixed(0)}
                </td>
                <td className="px-2.5 py-2 text-right font-bold font-mono text-brand-navy">
                  {formatCurrency(installationCost)}
                </td>
              </tr>
              {transportCharge > 0 && (
                <tr>
                  <td className="px-2.5 py-2 font-bold" colSpan={3}>
                    Transport & Delivery
                  </td>
                  <td className="px-2.5 py-2 text-right font-bold font-mono text-brand-navy">
                    {formatCurrency(transportCharge)}
                  </td>
                </tr>
              )}
              {additionalCharge > 0 && (
                <tr>
                  <td className="px-2.5 py-2 font-bold" colSpan={3}>
                    Preparatory / Additional Work
                  </td>
                  <td className="px-2.5 py-2 text-right font-bold font-mono text-brand-navy">
                    {formatCurrency(additionalCharge)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bright Brand Orange Grand Total Estimates box */}
      <div className="bg-brand-orange text-white rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider block">
            Estimated Grand Total
          </span>
          <span className="text-[8px] text-white/70 block font-light leading-none mt-0.5">
            Material + Installation inclusive
          </span>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black font-mono">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Add to Enquiry Button with clear feedback */}
        <button
          type="button"
          onClick={handleAddResultToEnquiry}
          disabled={addedToEnquiry}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            addedToEnquiry
              ? 'bg-emerald-500 text-white shadow-none'
              : 'bg-brand-navy hover:bg-brand-navy/95 text-white shadow-xs'
          }`}
        >
          {addedToEnquiry ? (
            <>
              <CheckCircle2 className="h-4.5 w-4.5 animate-bounce" /> Added to Enquiry Basket!
            </>
          ) : (
            <>
              <PlusCircle className="h-4.5 w-4.5" /> Add Result to Enquiry
            </>
          )}
        </button>

        {/* WhatsApp Estimate Panel */}
        <div className="space-y-1 bg-brand-ivory/50 p-2.5 rounded-xl border border-brand-navy/5">
          <label className="text-[9px] font-bold text-brand-navy uppercase tracking-wider block">
            Share Estimate via WhatsApp
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={whatsappNum}
              onChange={(e) => setWhatsappNum(e.target.value)}
              placeholder="919999999999"
              className="flex-grow rounded-lg border border-brand-navy/15 px-2.5 py-1.5 text-xs font-semibold text-brand-navy focus:outline-none focus:border-brand-orange bg-white"
            />
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-1.5 bg-whatsapp hover:bg-emerald-600 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-white" /> Send Estimate
            </button>
          </div>
        </div>

        {/* Book Measurement Visit */}
        <button
          type="button"
          onClick={handleBookVisitClick}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="h-4.5 w-4.5" /> Book Free Site Measurement
        </button>

        {/* Recalculate and Reset footer */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-navy/5 text-center">
          <button
            type="button"
            onClick={onRecalculate}
            className="flex items-center justify-center gap-1 py-1 px-2 text-[10px] font-bold text-brand-navy hover:text-brand-orange transition-all cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Recalculate
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1 py-1 px-2 text-[10px] font-bold text-brand-secondary hover:text-brand-navy transition-all cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Reset Calculator
          </button>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="pt-2.5 border-t border-brand-navy/5 flex gap-1.5 items-start text-[9px] text-brand-secondary leading-normal font-sans">
        <Info className="h-4 w-4 text-brand-navy shrink-0 mt-0.5" />
        <p className="font-light">
          This estimate is approximate only. Pattern matching, waste factor, and site-level factors may affect product requirements. Please confirm with WallDecor99 final site audits.
        </p>
      </div>
    </div>
  );
};
