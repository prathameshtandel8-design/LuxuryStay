import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/');
    } else {
      // Trigger entrance animation
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const isCard = booking.payment_method === 'Credit/Debit Card';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden" data-testid="payment-success-page">

      {/* Animated background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div
        className="relative z-10 transition-all duration-700 ease-out"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        }}
      >
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardHeader>
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="absolute w-24 h-24 bg-accent/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <CheckCircle className="w-20 h-20 text-accent relative z-10" />
              </div>
              <CardTitle className="text-3xl font-black">Payment Successful!</CardTitle>
              <p className="text-muted-foreground mt-2">Your booking has been confirmed</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method Badge */}
            {booking.payment_method && (
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                  {isCard ? (
                    <CreditCard className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                  Paid via {booking.payment_method}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="bg-muted/50 p-6 rounded-2xl">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hotel</span>
                  <span className="font-bold text-right max-w-[200px] truncate">{booking.hotel_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-semibold">{booking.check_in}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-semibold">{booking.check_out}</span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-3">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-bold text-lg text-primary">
                    ₹{booking.total_price?.toFixed?.(2) ?? booking.total_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-accent capitalize">{booking.status}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              A confirmation email has been sent. We look forward to hosting you!
            </p>

            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="w-full rounded-full font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 text-white h-12"
              data-testid="back-home-button"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;