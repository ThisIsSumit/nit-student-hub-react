import { useEffect } from 'react';
import { Users, BookOpen, Code } from 'lucide-react';

function Home() {
  useEffect(() => {
    // Enhanced animation sequence using CSS transitions
    const cards = document.querySelectorAll('.card');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // Animate hero elements
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.transform = 'translateY(0)';
    }, 400);
    
    // Animate cards with stagger
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 600 + index * 150);
    });
  }, []);

  const cards = [
    {
      href: "/roommate",
      icon: Users,
      title: "Roommate Finder",
      description: "Connect with compatible roommates and find your ideal living situation",
      gradient: "from-purple-600 via-purple-700 to-indigo-800",
      hoverGradient: "from-purple-500 via-purple-600 to-indigo-700",
      iconColor: "text-purple-200"
    },
    {
      href: "/study",
      icon: BookOpen,
      title: "Study Groups",
      description: "Form collaborative study groups and excel in your academics together",
      gradient: "from-emerald-600 via-teal-700 to-cyan-800",
      hoverGradient: "from-emerald-500 via-teal-600 to-cyan-700",
      iconColor: "text-emerald-200"
    },
    {
      href: "/hackathon",
      icon: Code,
      title: "Hackathon Teams",
      description: "Build innovative hackathon teams and create amazing projects",
      gradient: "from-orange-600 via-red-700 to-pink-800",
      hoverGradient: "from-orange-500 via-red-600 to-pink-700",
      iconColor: "text-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-3/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent opacity-0 transform translate-y-8 transition-all duration-800 ease-out">
            NIT Hamirpur Hub
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0 transform translate-y-4 transition-all duration-600 ease-out">
            Your gateway to building meaningful connections and collaborative experiences at NIT Hamirpur
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <a
                key={index}
                href={card.href}
                className={`card group relative overflow-hidden bg-gradient-to-br ${card.gradient} 
                  p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 
                  transform hover:-translate-y-2 hover:scale-105 border border-white/10 
                  backdrop-blur-sm opacity-0 translate-y-8 cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault();
                  // alert(`Navigating to ${card.title} section`);
                    window.location.href = card.href;
                  
                  
                }}
              >
                {/* Card glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.hoverGradient} 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                      <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-100 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-200 group-hover:text-gray-100 transition-colors leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Hover arrow */}
                  <div className="mt-6 flex items-center text-white/70 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Get Started</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              </a>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg">
            Join thousands of students already connected through our platform
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;