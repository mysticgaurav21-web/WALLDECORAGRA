/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { EmptyState } from '../components/EmptyState';
import { Trash2, Plus, Minus, Send, PhoneCall, CheckCircle, Clipboard, MessageSquare, AlertCircle } from 'lucide-react';
import { EnquiryFormInput } from '../types';

export const EnquiryBasketPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    basket,
    updateBasketQuantity,
    removeFromBasket,
    clearBasket,
    submitMessage,
    setSubmitMessage,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState<EnquiryFormInput>({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: '',
    address: '',
    estimatedArea: '',
    message: '',
    preferredContact: 'WhatsApp',
  });

  React.useEffect(() => {
    const calcSummary = localStorage.getItem('wd99_calc_summary');
    const calcArea = localStorage.getItem('wd99_calc_area');
    if (calcSummary || calcArea) {
      setFormInput((prev) => ({
        ...prev,
        estimatedArea: calcArea || prev.estimatedArea,
        message: calcSummary ? (prev.message ? `${prev.message}\n\n${calcSummary}` : calcSummary) : prev.message,
      }));
      localStorage.removeItem('wd99_calc_summary');
      localStorage.removeItem('wd99_calc_area');
    }
  }, []);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Totals
  const totalItems = basket.reduce((acc, item) => acc + item.quantity, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic Validation
    if (!formInput.name.trim()) {
      setValidationError('Please provide your full name.');
      return;
    }
    if (!formInput.mobile.trim() || formInput.mobile.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formInput.whatsapp.trim() || formInput.whatsapp.length < 10) {
      setValidationError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!formInput.city.trim()) {
      setValidationError('Please mention your city.');
      return;
    }

    setLoading(true);

    // Simulate enquiry submission
    setTimeout(() => {
      const refNo = `WD99-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your product enquiry has been received successfully.',
        refNo: refNo,
      });
      setLoading(false);
      clearBasket(); // Clear basket on success
    }, 1500);
  };

  // Prefilled WhatsApp message generation
  const generateWhatsAppMessage = () => {
    if (!submitMessage || !submitMessage.refNo) return '';
    let text = `*New Product Enquiry - WallDecor99*\n`;
    text += `*Reference No:* ${submitMessage.refNo}\n`;
    text += `*Name:* ${formInput.name}\n`;
    text += `*Mobile:* ${formInput.mobile}\n`;
    text += `*City:* ${formInput.city}\n`;
    if (formInput.estimatedArea) text += `*Estimated Area:* ${formInput.estimatedArea}\n`;
    if (formInput.message) text += `*Message:* ${formInput.message}\n`;
    text += `*Preferred Contact:* ${formInput.preferredContact}\n\n`;
    text += `*Interested Products:* (Simulated from enquiry basket)\n`;
    
    // Add dummy or prior basket products (we can use raw names for demonstration)
    text += `I am looking forward to receiving design brochures and catalogs. Please assist with estimates.`;
    
    return encodeURIComponent(text);
  };

  const handleResetForm = () => {
    setSubmitMessage(null);
    setFormInput({
      name: '',
      mobile: '',
      whatsapp: '',
      email: '',
      city: '',
      address: '',
      estimatedArea: '',
      message: '',
      preferredContact: 'WhatsApp',
    });
  };

  // Success screen
  if (submitMessage) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <Breadcrumb items={[{ label: 'Enquiry Received' }]} />

        <div className="bg-white rounded-2xl border border-brand-navy/10 p-6 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="mx-auto p-4 rounded-full bg-emerald-50 text-emerald-500 w-fit">
            <CheckCircle className="h-16 w-16 stroke-1.5" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Enquiry Submitted Successfully!
            </h1>
            <p className="text-sm text-brand-secondary max-w-md mx-auto">
              Your inquiry has been successfully generated. Our trade representatives will reach out to you within 2-4 business hours.
            </p>
          </div>

          {/* Reference Code Card */}
          <div className="p-5 bg-brand-ivory rounded-xl border border-brand-navy/5 max-w-sm mx-auto space-y-1.5">
            <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider block">
              Enquiry Reference Code
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-navy tracking-widest font-mono">
              {submitMessage.refNo}
            </div>
            <p className="text-[10px] text-brand-secondary/80 font-light leading-none">
              Please quote this reference code for future followups.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            {/* Dispatch to WhatsApp button */}
            <a
              href={`https://wa.me/919999999999?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-whatsapp hover:bg-opacity-90 text-sm font-bold text-white py-4 shadow-sm transition-all"
            >
              <MessageSquare className="h-4.5 w-4.5 fill-white" />
              WhatsApp Details
            </a>

            {/* Quick Call */}
            <a
              href="tel:+919999999999"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-navy/15 text-brand-navy hover:bg-brand-ivory text-sm font-bold py-4 transition-all"
            >
              <PhoneCall className="h-4.5 w-4.5" />
              Call Showroom Now
            </a>
          </div>

          {/* Reset form button */}
          <div className="pt-4">
            <button
              onClick={handleResetForm}
              className="text-xs font-bold text-brand-orange underline hover:text-brand-navy cursor-pointer"
            >
              Submit Another Enquiry / Clear Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state if basket has no items
  if (basket.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <Breadcrumb items={[{ label: 'Enquiry Basket' }]} />
        <div className="py-12">
          <EmptyState
            title="Your Enquiry Basket is Empty"
            description="Explore our wall panels, frosted films, wooden flooring, and blinds collections to add specifications for estimated pricing and installation assistance."
            actionLabel="Discover Products"
            onActionClick={() => navigate('/categories')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Enquiry Basket' }]} />

      {/* Header */}
      <div className="border-b border-brand-navy/10 pb-6 mb-8">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Quote Preparation
        </span>
        <h1 className="font-display text-3xl font-extrabold text-brand-navy mt-1">
          Review Enquiry List
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Review your chosen specifications below, state your project details, and submit to receive complete price estimations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Selected Products list */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-navy/10 overflow-hidden shadow-xs">
          <div className="bg-brand-navy text-white p-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold tracking-wide">
              Selected Catalogue Items ({totalItems})
            </h2>
            <button
              onClick={clearBasket}
              className="text-[10px] text-white/70 hover:text-brand-orange hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </button>
          </div>

          <div className="divide-y divide-brand-navy/10">
            {basket.map(({ product, quantity }) => {
              const itemTotal = product.sellingPrice * quantity;
              const formattedItemTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(itemTotal);

              return (
                <div key={product.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-brand-ivory border border-brand-navy/5 shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 space-y-1">
                    <Link
                      to={`/products/${product.id}`}
                      className="font-display text-sm font-extrabold text-brand-navy hover:text-brand-orange transition-colors line-clamp-1"
                    >
                      {product.productName}
                    </Link>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-brand-secondary font-medium">
                      <span>Code: <span className="text-brand-text font-bold">{product.productCode}</span></span>
                      <span>Size: <span className="text-brand-text font-semibold">{product.size}</span></span>
                      {product.thickness && (
                        <span>Thickness: <span className="text-brand-text font-semibold">{product.thickness}</span></span>
                      )}
                    </div>
                    {/* Unit pricing */}
                    <div className="text-xs font-semibold text-brand-navy">
                      ₹{product.sellingPrice} <span className="text-[10px] text-brand-secondary font-normal">/ {product.unit}</span>
                    </div>
                  </div>

                  {/* Quantity and removal */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {/* Quantity Selector buttons */}
                    <div className="flex items-center border border-brand-navy/15 rounded-xl bg-brand-ivory p-0.5">
                      <button
                        onClick={() => updateBasketQuantity(product.id, quantity - 1)}
                        className="p-1 text-brand-navy hover:text-brand-orange hover:bg-white rounded"
                        title="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold font-mono text-brand-text min-w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateBasketQuantity(product.id, quantity + 1)}
                        className="p-1 text-brand-navy hover:text-brand-orange hover:bg-white rounded"
                        title="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromBasket(product.id)}
                      className="text-[10px] text-brand-secondary hover:text-red-500 font-bold flex items-center gap-1 cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-brand-ivory p-4 border-t border-brand-navy/10 text-right space-y-1">
            <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider block">
              Estimated Total Materials Requirement
            </span>
            <div className="text-lg font-black text-brand-navy">
              {basket.length} unique items / {totalItems} total units
            </div>
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-navy/10 p-6 shadow-xs space-y-5">
          <div className="border-b border-brand-navy/10 pb-3">
            <h2 className="font-display text-base font-bold text-brand-navy">
              Contact & Project Details
            </h2>
            <p className="text-[10px] text-brand-secondary font-light font-sans mt-0.5">
              Provide authentic contact details. No payments or login required.
            </p>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex gap-2 items-start border border-red-200">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                Full Name <span className="text-brand-orange">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formInput.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {/* Phone & Whatsapp row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                  Mobile Number <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formInput.mobile}
                  onChange={handleInputChange}
                  placeholder="98765 43210"
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                  WhatsApp Number <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={formInput.whatsapp}
                  onChange={handleInputChange}
                  placeholder="98765 43210"
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Email (Optional) & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                  Email Address <span className="text-brand-secondary/60">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formInput.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                  City <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formInput.city}
                  onChange={handleInputChange}
                  placeholder="Gurugram"
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Estimated Area / Quantity */}
            <div>
              <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                Estimated Area or Material Quantity
              </label>
              <input
                type="text"
                name="estimatedArea"
                value={formInput.estimatedArea}
                onChange={handleInputChange}
                placeholder="e.g. 350 sq ft or 10 sheets"
                className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {/* Installation site Address (optional) */}
            <div>
              <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                Site Address <span className="text-brand-secondary/60">(Optional)</span>
              </label>
              <input
                type="text"
                name="address"
                value={formInput.address}
                onChange={handleInputChange}
                placeholder="Plot 45, Sector 15"
                className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {/* Message / Requirements */}
            <div>
              <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                Additional Requirements / Special Notes
              </label>
              <textarea
                name="message"
                value={formInput.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g. Need catalogs for WPC louvers, require installation assistance next Friday."
                className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
              />
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-1.5">
                Preferred Contact Channel
              </label>
              <select
                name="preferredContact"
                value={formInput.preferredContact}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs sm:text-sm text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
              >
                <option value="WhatsApp">WhatsApp Message</option>
                <option value="Phone">Direct Phone Call</option>
                <option value="Email">Email Communication</option>
              </select>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange hover:bg-opacity-95 text-sm font-bold text-white py-4 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Enquiry...
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    Send Trade Enquiry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
