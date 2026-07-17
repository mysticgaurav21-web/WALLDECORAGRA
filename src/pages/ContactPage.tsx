/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formInput, setFormInput] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Inquiry',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formInput.name.trim()) {
      setErrorMsg('Please state your full name.');
      return;
    }
    if (!formInput.phone.trim() || formInput.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formInput.message.trim()) {
      setErrorMsg('Please type your inquiry message.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setSuccess(false);
    setFormInput({
      name: '',
      phone: '',
      email: '',
      subject: 'General Product Inquiry',
      message: '',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Contact Showroom' }]} />

      {/* Page Header */}
      <div className="border-b border-brand-navy/10 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
          Establish Connection
        </span>
        <h1 className="font-display text-3xl font-extrabold text-brand-navy mt-1">
          Contact Our Decor Experts
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary mt-1">
          Have customized wall dimensions or wallpaper patterns to consult? Get in touch or visit our Gurugram experience showroom today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Coordinates (Left) */}
        <div className="lg:col-span-5 bg-white border border-brand-navy/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-base font-bold text-brand-navy border-b border-brand-navy/5 pb-2">
              WallDecor99 HQ
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-brand-text">
              {/* Address */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-brand-ivory rounded-lg text-brand-orange shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-brand-navy text-sm">Experience Center Location</p>
                  <p className="text-xs text-brand-secondary font-light leading-relaxed mt-0.5">
                    WallDecor99 Showroom, Ground Floor, <br />
                    Sector 45, Near Huda City Metro, <br />
                    Gurugram, Haryana - 122003
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-brand-ivory rounded-lg text-brand-orange shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-brand-navy text-sm">Call Support</p>
                  <p className="text-xs text-brand-secondary font-mono mt-0.5">
                    <a href="tel:+919999999999" className="hover:text-brand-orange transition-colors">
                      +91 99999 99999
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-brand-ivory rounded-lg text-brand-orange shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-brand-navy text-sm">Inquiry Mailbox</p>
                  <p className="text-xs text-brand-secondary mt-0.5">
                    <a href="mailto:enquiry@walldecor99.com" className="hover:text-brand-orange transition-colors">
                      enquiry@walldecor99.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-brand-ivory rounded-lg text-brand-orange shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-brand-navy text-sm">Working Hours</p>
                  <p className="text-xs text-brand-secondary leading-relaxed mt-0.5 font-light">
                    Monday to Saturday: 10:00 AM – 08:00 PM <br />
                    Sundays: Closed (Appointments only)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-navy/10 mt-6 bg-brand-ivory flex items-center justify-center text-center p-4">
            <div className="absolute inset-0 opacity-15">
              <div className="h-full w-full bg-[radial-gradient(#08234a_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
            <div className="relative z-10 space-y-1.5">
              <MapPin className="h-6 w-6 text-brand-orange mx-auto" />
              <p className="text-xs font-bold text-brand-navy">Interactive Map Placeholder</p>
              <p className="text-[10px] text-brand-secondary font-light max-w-[220px] leading-relaxed mx-auto">
                Gurugram Sector 45 Showroom Area, Haryana
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="lg:col-span-7 bg-white border border-brand-navy/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-center">
          {success ? (
            <div className="text-center py-10 space-y-5">
              <div className="mx-auto p-3.5 rounded-full bg-emerald-50 text-emerald-500 w-fit">
                <CheckCircle className="h-12 w-16 stroke-1.5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-brand-navy">Message Sent Successfully!</h3>
                <p className="text-xs text-brand-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A showroom decor representative will reply to your registered email or phone line shortly.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-brand-navy/10 text-brand-navy text-xs font-bold hover:bg-brand-ivory transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-b border-brand-navy/5 pb-2.5">
                <h2 className="font-display text-base font-bold text-brand-navy">
                  Send A Message
                </h2>
                <p className="text-[10px] text-brand-secondary">
                  Fill out the form below and we will help you draft quotes and catalogs.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs font-semibold rounded-xl flex gap-1.5 items-center">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Full Name <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formInput.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full rounded-xl border border-brand-navy/15 py-3.5 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>

                {/* Contact phone & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                      Phone Number <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formInput.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile"
                      className="w-full rounded-xl border border-brand-navy/15 py-3.5 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                      Email Address <span className="text-brand-secondary/60">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formInput.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-brand-navy/15 py-3.5 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formInput.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-brand-navy/15 py-3.5 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                  >
                    <option value="General Product Inquiry">General Product Inquiry</option>
                    <option value="Installation Support Request">Installation Support Request</option>
                    <option value="Showroom Dealer/Bulk Inquiry">Showroom Dealer/Bulk Inquiry</option>
                    <option value="Site Estimation Measurements">Site Estimation Measurements</option>
                  </select>
                </div>

                {/* Message text */}
                <div>
                  <label className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block mb-1">
                    Your Message / Inquiry Details <span className="text-brand-orange">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formInput.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe what you are looking for..."
                    className="w-full rounded-xl border border-brand-navy/15 py-3.5 px-4 text-xs text-brand-text focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange hover:bg-opacity-95 text-white text-sm font-bold py-4 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="h-4.5 w-4.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
