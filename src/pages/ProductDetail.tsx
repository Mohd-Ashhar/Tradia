import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductHeader } from '@/components/ProductHeader';
import { ProductImageViewer } from '@/components/ProductImageViewer';
import { ProductReviews } from '@/components/ProductReviews';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  RotateCcw, 
  Sparkles,
  Award,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { allProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Find the actual product by ID
  const productData = allProducts.find(p => p.id === id);

  useEffect(() => {
    if (!productData) {
      navigate('/products');
    }
  }, [productData, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !hasAnimated) {
        setHasAnimated(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  if (!productData) {
    return null;
  }

  const product = {
    ...productData,
    description: productData.name + ' - Experience timeless elegance with this meticulously crafted piece. Made from the finest materials, combining sophisticated design with exceptional functionality.',
    images: [productData.image],
    inStock: true,
    features: [
      { icon: Sparkles, title: 'Premium Materials', description: 'Sourced from the finest suppliers worldwide' },
      { icon: Award, title: 'Handcrafted Excellence', description: 'Over 40 hours of meticulous craftsmanship' },
      { icon: Package, title: 'Quality Construction', description: 'Built to last with attention to detail' },
      { icon: Shield, title: 'Lifetime Guarantee', description: 'We stand behind our quality' },
    ],
    specifications: [
      { label: 'Category', value: productData.category },
      { label: 'Material', value: 'Premium Quality' },
      { label: 'Finish', value: 'Handcrafted' },
      { label: 'Quality', value: 'Luxury Grade' },
      { label: 'Care', value: 'Professional cleaning recommended' },
      { label: 'Origin', value: 'Made with care' },
    ],
  };

  const handleAddToCart = () => {
    addToCart(productData, quantity);
    toast.success('Added to cart!', {
      description: `${quantity} × ${product.name}`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="transition-colors hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Main Content - Split Screen */}
      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side - Image Viewer */}
          <div className="animate-fade-in-up">
            <ProductImageViewer images={product.images} productName={product.name} />
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Category & Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {product.category}
              </Badge>
              {product.inStock && (
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                  In Stock
                </Badge>
              )}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-gradient">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-accent text-white">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 transition-colors hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 transition-colors hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="group relative flex-1 overflow-hidden bg-gradient-to-r from-primary to-accent text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-[var(--shadow-premium)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>

              <Button
                onClick={handleWishlist}
                variant="outline"
                size="lg"
                className="glass-morphism transition-all hover:scale-105"
              >
                <Heart
                  className={isWishlisted ? 'fill-accent text-accent' : ''}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-2">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="glass-morphism rounded-xl p-4 transition-all hover:shadow-lg animate-scale-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <feature.icon className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Shipping & Returns */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-medium">Free shipping on orders over $500</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="font-medium">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Lifetime craftsmanship guarantee</span>
              </div>
            </div>

            {/* Specifications */}
            <div
              className={`glass-morphism rounded-2xl p-6 transition-all duration-1000 ${
                hasAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <h3 className="mb-4 text-xl font-bold">Specifications</h3>
              <dl className="grid gap-3 sm:grid-cols-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">{spec.label}</dt>
                    <dd className="mt-1 font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          className={`mt-16 transition-all duration-1000 ${
            hasAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <ProductReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
