"use client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative text-white min-h-screen overflow-hidden">
      {/* NAVIGATION */}
      <Navbar activePage="about" />
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background-theme.png")',
        }}
      />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 "
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-7xl md:text-8xl font-light tracking-wider mb-6 animate-fade-in">
            OUR STORY
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
            Where centuries of craftsmanship meet modern innovation
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section className="py-32 px-6   max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-light tracking-wider mb-8">
              Heritage
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Founded in the heart of Italy, VERONA represents the pinnacle of
              jewelry artistry. Our atelier has been crafting extraordinary
              pieces for discerning clients who appreciate the fusion of
              traditional techniques and contemporary design.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Each creation is born from a deep respect for the materials we
              work with and the stories they tell. Our master jewelers bring
              decades of experience, ensuring every piece meets the highest
              standards of excellence.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden border border-white/10">
            <img
              src="assets/images/heritage_image.png"
              alt="VERONA heritage workshop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-white/40">◇</div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-32 px-6 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light tracking-wider mb-12">
            Our Philosophy
          </h2>
          <p className="text-2xl font-light text-gray-300 leading-relaxed mb-16">
            "Luxury is not about possession, but about experience. Each piece we
            create is a journey—a dialogue between artisan and client, past and
            present, earth and imagination."
          </p>

          <div className="grid md:grid-cols-3 gap-12 mt-20">
            <div className="p-8 border border-white/10 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl tracking-wider mb-4">CRAFTSMANSHIP</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every piece is handcrafted by master jewelers with decades of
                experience
              </p>
            </div>

            <div className="p-8 border border-white/10 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-4xl mb-4">◇</div>
              <h3 className="text-xl tracking-wider mb-4">ETHICS</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We source only conflict-free, ethically mined materials with
                full transparency
              </p>
            </div>

            <div className="p-8 border border-white/10 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-4xl mb-4">✧</div>
              <h3 className="text-xl tracking-wider mb-4">INNOVATION</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Blending traditional techniques with cutting-edge technology and
                design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <h2 className="text-5xl font-light tracking-wider mb-20 text-center">
          The Journey
        </h2>

        <div className="space-y-24">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <div className="text-8xl font-light text-white/20">01</div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-3xl font-light mb-4 tracking-wide">
                Consultation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your vision becomes our blueprint. Through intimate
                conversations, we understand your story, preferences, and the
                emotion you wish to capture in your piece.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-1/3 text-right">
              <div className="text-8xl font-light text-white/20">02</div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-3xl font-light mb-4 tracking-wide">Design</h3>
              <p className="text-gray-400 leading-relaxed">
                Our designers translate your dreams into sketches and 3D
                renderings, refining every detail until the design perfectly
                captures your vision.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <div className="text-8xl font-light text-white/20">03</div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-3xl font-light mb-4 tracking-wide">
                Creation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Master jewelers bring the design to life, meticulously crafting
                each element with precision and care that only comes from
                decades of experience.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-1/3 text-right">
              <div className="text-8xl font-light text-white/20">04</div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-3xl font-light mb-4 tracking-wide">
                Forever
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your piece is delivered in a ceremony befitting its
                significance, with lifetime care and support from our atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 px-6 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-light tracking-wider mb-20 text-center">
            Master Artisans
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Alessandro Romano",
                role: "Master Jeweler",
                years: "35 Years",
              },
              {
                name: "Lucia Bianchi",
                role: "Lead Designer",
                years: "28 Years",
              },
              { name: "Marco Ferretti", role: "Gemologist", years: "30 Years" },
            ].map((person, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <div className="w-full aspect-square rounded-lg mb-6 border border-white/10 overflow-hidden relative group-hover:border-white/30 transition-all duration-500">
                  {/* Image fills the square */}
                  <img
                    src="/person_image.jpg"
                    alt="VERONA artisan portrait"
                    className="w-full h-full object-cover"
                  />

                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl text-white/10 group-hover:text-white/20 transition-all duration-500">
                      ◇
                    </span>
                  </div>
                </div>

                <h3 className="text-xl tracking-wider mb-2">{person.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{person.role}</p>
                <p className="text-gray-600 text-xs">
                  {person.years} Experience
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light tracking-wider mb-8">
            Begin Your Journey
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Schedule a consultation with our master jewelers and discover how we
            can bring your vision to life.
          </p>
          <button className="px-12 py-4 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-widest text-sm">
            BOOK CONSULTATION
          </button>
        </div>
      </section>
 <Footer />
      
    </div>
  );
}
