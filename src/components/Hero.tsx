import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div 
          className="h-[120vh] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Glassmorphic Card */}
            <div className="glass-morphism rounded-3xl p-8 sm:p-12 shadow-[var(--shadow-glass)] animate-fade-in-up">
              {/* Eyebrow Text */}
              <div className="mb-4 inline-block">
                <span className="text-sm font-medium tracking-wider text-primary uppercase">
                  New Collection 2024
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Elevate Your{' '}
                <span className="text-gradient">Style</span>
              </h1>

              {/* Description */}
              <p className="mb-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Discover curated collections that blend timeless elegance with contemporary design. 
                Premium quality, exceptional craftsmanship.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button 
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-[var(--shadow-premium)] transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-base font-medium">
                      Shop New Arrivals
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>

                <Link to="/products">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="glass-morphism border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <span className="text-base font-medium">Explore Collections</span>
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border/50 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gradient">500+</div>
                  <div className="text-sm text-muted-foreground mt-1">Premium Items</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">50K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float-slow" />
    </section>
  );
};
