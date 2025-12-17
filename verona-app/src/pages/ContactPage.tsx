"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { ChevronDown } from 'lucide-react';
import { useRef } from "react";
import Footer from "../components/Footer";


export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: ""
    });
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const formRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "general",
                message: ""
            });
            setSubmitSuccess(false);
        }, 3000);
    };

    const faqs = [
        {
            q: "How do I schedule a consultation?",
            a: "You can book a consultation through our contact form, by calling us directly, or by visiting our atelier. We recommend booking at least 2 weeks in advance for custom designs."
        },
        {
            q: "What is the typical timeline for custom pieces?",
            a: "Custom jewelry typically takes 6-12 weeks from initial consultation to completion, depending on the complexity of the design and stone sourcing requirements."
        },
        {
            q: "Do you offer international shipping?",
            a: "Yes, we ship worldwide with fully insured, secure delivery. International orders typically arrive within 5-10 business days."
        },
        {
            q: "What is your return policy?",
            a: "We offer a 30-day return policy for non-custom pieces. Custom-designed jewelry is final sale, though we work closely with you throughout the process to ensure satisfaction."
        },
        {
            q: "Do you provide certificates of authenticity?",
            a: "Every piece comes with a certificate of authenticity detailing materials, gemstone specifications, and craftsmanship details."
        }
    ];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };



    return (
        <div className="bg-black text-white min-h-screen">
            {/* NAVIGATION */}
            <Navbar activePage="contact" />

            {/* PASTE THE BACKGROUND IMAGE CODE HERE 👇 */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url(/background-theme.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >

            </div>

            <div className="relative z-10">

                {/* HERO SECTION */}
                <section className="pt-32 pb-16 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-6">
                            GET IN TOUCH
                        </h1>
                        <div className="w-24 h-px bg-white mx-auto mb-6"></div>
                        <p className="text-xl ext-white-400 max-w-2xl mx-auto">
                            We're here to help you create something extraordinary.
                            Reach out to our team of specialists.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 pb-20">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* CONTACT FORM - Takes 2 columns */}
                        <div ref={formRef} className="lg:col-span-2">
                            <div className="border border-white/10 rounded-lg p-8 md:p-12 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                                <h2 className="text-3xl font-light tracking-wider mb-8">Send us a Message</h2>

                                {submitSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-6">✓</div>
                                        <h3 className="text-2xl font-light mb-4">Thank You!</h3>
                                        <p className="text-gray-400">
                                            Your message has been received. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Name & Email Row */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm tracking-wider mb-2 text-gray-400">
                                                    FULL NAME *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/60 transition"
                                                    placeholder="Alessandro Romano"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm tracking-wider mb-2 text-gray-400">
                                                    EMAIL ADDRESS *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/60 transition"
                                                    placeholder="alessandro..example.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone & Subject Row */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm tracking-wider mb-2 text-gray-400">
                                                    PHONE NUMBER
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/60 transition"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm tracking-wider mb-2 text-gray-400">
                                                    SUBJECT *
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/60 transition cursor-pointer"
                                                >
                                                    <option value="general">General Inquiry</option>
                                                    <option value="custom">Custom Design</option>
                                                    <option value="appointment">Book Appointment</option>
                                                    <option value="existing">Existing Order</option>
                                                    <option value="repair">Repair & Maintenance</option>
                                                    <option value="partnership">Partnership</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm tracking-wider mb-2 text-gray-400">
                                                YOUR MESSAGE *
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/60 transition resize-none"
                                                placeholder="Tell us about your vision..."
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto px-12 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 tracking-widest text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                                        </button>

                                        <p className="text-xs text-gray-500 mt-4">
                                            * Required fields. We typically respond within 24 hours.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CONTACT INFO SIDEBAR - Takes 1 column */}
                        <div className="space-y-6">

                            {/* Visit Us */}
                            <div className="border border-white/10 rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                                <div className="text-3xl mb-4">📍</div>
                                <h3 className="text-xl tracking-wider mb-3">Visit Our Atelier</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Via Cappello 23<br />
                                    37121 Verona, Italy
                                </p>
                                <p className="text-xs text-gray-500">
                                    By appointment only
                                </p>
                            </div>

                            {/* Call Us */}
                            <div className="border border-white/10 rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                                <div className="text-3xl mb-4">📞</div>
                                <h3 className="text-xl tracking-wider mb-3">Call Us</h3>
                                <p className="text-gray-400 text-sm mb-2">
                                    +39 045 123 4567
                                </p>
                                <p className="text-xs text-gray-500">
                                    Mon - Fri: 10:00 - 18:00 CET<br />
                                    Sat: 11:00 - 16:00 CET
                                </p>
                            </div>

                            {/* Email Us */}
                            <div className="border border-white/10 rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                                <div className="text-3xl mb-4">✉️</div>
                                <h3 className="text-xl tracking-wider mb-3">Email Us</h3>
                                <p className="text-gray-400 text-sm mb-1">
                                    info..verona-jewelry.com
                                </p>
                                <p className="text-gray-400 text-sm mb-4">
                                    custom..verona-jewelry.com
                                </p>
                                <p className="text-xs text-gray-500">
                                    Response within 24 hours
                                </p>
                            </div>

                            {/* Social Media */}
                            <div className="border border-white/10 rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                                <div className="text-3xl mb-4">✦</div>
                                <h3 className="text-xl tracking-wider mb-3">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                                        <span className="text-sm">IG</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                                        <span className="text-sm">FB</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                                        <span className="text-sm">PT</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                                        <span className="text-sm">X</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* FAQ SECTION */}


                <section className="border border-white/10 rounded-lg p-8 md:p-12 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-12 text-center">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300"
                                >
                                    <button
                                        onClick={() => toggleAccordion(i)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
                                    >
                                        <h3 className="text-lg tracking-wide pr-4">{faq.q}</h3>
                                        <ChevronDown
                                            className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <p className="text-gray-400 text-sm leading-relaxed px-6 pb-6">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>




                {/* MAP SECTION */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-light tracking-wider mb-8 text-center">
                            Find Us in Verona
                        </h2>
                        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-white/10 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl text-white/10 mb-4">📍</div>
                                <p className="text-gray-400">Interactive map would be integrated here</p>
                                <p className="text-sm text-gray-500 mt-2">Via Cappello 23, 37121 Verona, Italy</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="border border-white/10 rounded-lg p-8 md:p-12 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-6">
                            Ready to Create Your Legacy?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Book a private consultation with our master jewelers and begin
                            your journey to owning a timeless masterpiece.
                        </p>
                        <button
                            onClick={scrollToForm}
                            className="px-12 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 tracking-widest text-sm font-medium"
                        >
                            BOOK APPOINTMENT
                        </button>

                    </div>
                </section>
 <Footer />
                
            </div>
        </div>
    );
}