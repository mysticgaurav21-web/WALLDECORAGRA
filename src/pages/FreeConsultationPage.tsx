/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { CATEGORIES } from '../data/mockData';
import { Calendar, CheckCircle, Sparkles, AlertCircle, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FreeConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [formInput, setFormInput] = useState({
    name: '',
    mobile: '',
    city: '',
    propertyType: 'Residential',
    roomType: 'Living Room',
    interestedCategory: CATEGORIES[0].name,
    approximateArea: '',
    budgetRange: '₹20,000 - ₹50,000',
    preferredVisitDate: '',
    message: '',
  });

  const propertyTypes = ['Residential Home', 'Commercial Retail Store', 'Corporate Office', 'Hospitality Hotel/Lobby'];
  const roomTypes = ['Living Room', 'Master Bedroom', 'Kitchen & Pantry', 'Shower / Bathroom', 'Office Conference Room', 'Full Floor Suite', 'Balcony / Cafe Wall'];
  const budgetRanges = ['Under ₹20,000', '₹20,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹3,00,000', 'Over ₹3,00,000'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validations
    if (!formInput.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formInput.mobile.trim() || formInput.mobile.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formInput.city.trim()) {
      setFormError('Please state your city.');
      return;
    }
    if (!formInput.preferredVisitDate) {
      setFormError('Please select a preferred showroom visit or site dimension date.');
      return;
    }

    setLoading(true);

    // Simulate database booking saving
    setTimeout(() => {
      const generatedRef = `CONS-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefNo(generatedRef);
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  const handleResetForm = () => {
    setSuccess(false);
    setFormInput({
      name: '',
      mobile: '',
      city: '',
      propertyType: 'Residential',
      roomType: 'Living Room',
      interestedCategory: CATEGORIES[0].name,
      approximateArea: '',
      budgetRange: '₹20,000 - ₹50,000',
      preferredVisitDate: '',
      message: '',
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Free Consultation' }]} />

      {success ? (
        /* Success Screen */
        <div className="bg-white rounded-2xl border border-brand-navy/10 p-6 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="mx-auto p-4 rounded-full bg-emerald-50 text-emerald-500 w-fit">
            <CheckCircle className="h-16 w-16 stroke-1.5 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Consultation Booked!
            </h1>
            <p className="text-sm text-brand-secondary max-w-md mx-auto">
              Our professional interior decorators are thrilled to consult on your project! We have assigned a design expert who will bring product sample kits to your destination.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 bg-brand-ivory rounded-xl border border-brand-navy/5 max-w-sm mx-auto space-y-1.5">
            <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider block">
              Consultation ID
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-navy tracking-widest font-mono">
              {refNo}
            </div>
            <p className="text-[10px] text-brand-secondary/80 font-light leading-none">
              Visit schedule set for: <span className="font-bold text-brand-orange">{formInput.preferredVisitDate}</span>
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('/categories')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-navy text-white text-xs font-bold py-4 shadow-sm hover:bg-opacity-95"
            >
              Continue Exploring Products
            </button>
            <button
              onClick={handleResetForm}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-navy/15 text-brand-navy hover:bg-brand-ivory text-xs font-bold py-4"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side panel */}
          <div className="lg:col-span-5 bg-brand-navy text-white p-6 sm:p-8 rounded-2xl space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-brand-orange/10 blur-2xl" />
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1.5 rounded-lg w-fit block">
              Showroom Visit or Site Estimate
            </span>

            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
              Let's Co-Create Your Dream Space
            </h2>

            <p className="text-xs text-brand-ivory/70 leading-relaxed font-light">
              Don't compromise on standard layouts. Reserve a dedicated consultant slot to discuss fluted wall designs, premium wallpapers, roller shade textures, or custom-pattern SPC flooring.
            </p>

            <div className="space-y-4 border-t border-white/10 pt-6 text-xs text-brand-ivory/80">
              <div className="flex gap-3 items-start">
                <span className="p-1 rounded-md bg-white/10 text-brand-orange shrink-0">✓</span>
                <div>
                  <p className="font-bold text-white">Bring Real Sample Materials</p>
                  <p className="text-[10px] font-light">We carry mini PVC fluted bars, wallpaper rolls, and SPC boards directly to your location.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="p-1 rounded-md bg-white/10 text-brand-orange shrink-0">✓</span>
                <div>
                  <p className="font-bold text-white">On-Site Measurement Takeover</p>
                  <p className="text-[10px] font-light">We measure carpet area, window heights, and television backdrops for precise fits.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="p-1 rounded-md bg-white/10 text-brand-orange shrink-0">✓</span>
                <div>
                  <p className="font-bold text-white">Detailed Estimation Drafts</p>
                  <p className="text-[10px] font-light">Complete breakdowns of materials count, installation fees, and accessory charges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-navy/10 p-6 shadow-xs space-y-5">
            <div className="border-b border-brand-navy/10 pb-3">
              <h2 className="font-display text-base font-bold text-brand-navy">
                Book Professional Consultation
              </h2>
              <p className="text-[10px] text-brand-secondary mt-0.5">
                Takes under 60 seconds. Our experts help align materials and design moods.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex gap-1.5 items-center border border-red-200">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Your Name <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formInput.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Contact Mobile <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formInput.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit phone"
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
              </div>

              {/* City & Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    City <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formInput.city}
                    onChange={handleInputChange}
                    placeholder="Gurugram"
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formInput.propertyType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                  >
                    {propertyTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Type & Interested Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Target Room Space
                  </label>
                  <select
                    name="roomType"
                    value={formInput.roomType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                  >
                    {roomTypes.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Interested Product Core
                  </label>
                  <select
                    name="interestedCategory"
                    value={formInput.interestedCategory}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Approx Area & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Approximate Installation Area
                  </label>
                  <input
                    type="text"
                    name="approximateArea"
                    value={formInput.approximateArea}
                    onChange={handleInputChange}
                    placeholder="e.g. 500 sq ft or 3 rooms"
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Estimated Budget Bracket
                  </label>
                  <select
                    name="budgetRange"
                    value={formInput.budgetRange}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                  >
                    {budgetRanges.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Visit Date */}
              <div>
                <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                  Preferred Visit / Measurement Date <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="date"
                  name="preferredVisitDate"
                  required
                  value={formInput.preferredVisitDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                  Share Your Vision / Brief Requirements
                </label>
                <textarea
                  name="message"
                  value={formInput.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. Seeking high-gloss golden marble UV sheets combined with dark charcoal vertical flutes for my home cinema room backdrop."
                  className="w-full rounded-xl border border-brand-navy/15 py-3 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange hover:bg-opacity-95 py-4 text-sm font-bold text-white shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Confirming Appointment...' : 'Schedule Free Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
