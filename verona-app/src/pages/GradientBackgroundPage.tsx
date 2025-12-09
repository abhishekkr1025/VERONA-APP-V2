import React from 'react';

export default function GradientBackgroundPage() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: 'url(/background-theme.png)'
      }}
    >
      {/* Content Container with glassmorphism effect */}
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="bg-black/30 backdrop-blur-md p-12 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Hero Title */}
          {/* <h1 className="text-6xl md:text-7xl font-light text-white tracking-wider mb-6">
            LUMINESCENCE
          </h1> */}
          
          {/* Subtitle */}
          {/* <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
            Where Digital Artistry Meets Haute Joaillerie
          </p> */}
          
          {/* Description */}
          {/* <p className="text-lg text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto">
            Experience the fusion of cutting-edge 3D technology and timeless craftsmanship. 
            Each piece tells a story of innovation, elegance, and unparalleled beauty.
          </p> */}
          
          {/* Call-to-Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              Explore Collection
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-all duration-300">
              Learn More
            </button>
          </div> */}
          
          {/* Features */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Handcrafted Excellence</h3>
              <p className="text-gray-300 text-sm">
                Each piece is meticulously crafted by master jewelers with decades of experience.
              </p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Ethical Sourcing</h3>
              <p className="text-gray-300 text-sm">
                We use only conflict-free diamonds and responsibly sourced precious metals.
              </p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">3D Visualization</h3>
              <p className="text-gray-300 text-sm">
                Preview your custom design in stunning detail before it's created.
              </p>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border border-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-12 right-12 w-32 h-32 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );
}