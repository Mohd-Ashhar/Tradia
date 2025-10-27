import { Link, useParams } from 'react-router-dom';
import { ProductHeader } from '@/components/ProductHeader';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />
      <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex h-[60vh] flex-col items-center justify-center gap-6 rounded-2xl glass-morphism p-10 text-center">
          <CheckCircle className="h-24 w-24 text-green-500" />
          <h1 className="font-heading text-4xl font-bold">Thank You!</h1>
          <p className="text-xl text-muted-foreground">
            Your order <span className="font-bold text-foreground">#{orderNumber}</span> has been placed successfully.
          </p>
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly.
          </p>
          <div className="mt-6 flex gap-4">
            <Button asChild size="lg">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass-morphism">
              <Link to="/orders">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;