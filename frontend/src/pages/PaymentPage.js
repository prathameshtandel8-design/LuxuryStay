import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const booking = location.state?.booking;

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI form state
  const [upiId, setUpiId] = useState('');

  // Validation error state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const validateCard = () => {
    const newErrors = {};
    const rawCard = cardNumber.replace(/\s/g, '');

    if (!rawCard || rawCard.length < 13 || rawCard.length > 16) {
      newErrors.cardNumber = 'Enter a valid card number (13-16 digits)';
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Enter a valid expiry (MM/YY)';
    } else {
      const [mm] = expiry.split('/').map(Number);
      if (mm < 1 || mm > 12) newErrors.expiry = 'Invalid month';
    }
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'Enter a valid CVV';
    }
    if (!cardName.trim()) {
      newErrors.cardName = 'Enter cardholder name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpi = () => {
    const newErrors = {};
    if (!upiId || !/^[\w.-]+@[\w]+$/.test(upiId)) {
      newErrors.upiId = 'Enter a valid UPI ID (e.g., name@upi)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    const isValid = paymentMethod === 'card' ? validateCard() : validateUpi();
    if (!isValid) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Payment successful!');
    navigate('/payment-success', {
      state: {
        booking: {
          ...booking,
          payment_method: paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI',
          status: 'confirmed',
        },
      },
    });
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-testid="payment-page">
      {/* Nav */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Luxury Stay</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Payment Form — Left */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-black">Payment Details</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Choose your preferred payment method
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs
                  defaultValue="card"
                  onValueChange={(val) => {
                    setPaymentMethod(val);
                    setErrors({});
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-14 rounded-xl bg-muted p-1.5">
                    <TabsTrigger
                      value="card"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground text-base font-semibold transition-all"
                      data-testid="card-tab"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger
                      value="upi"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground text-base font-semibold transition-all"
                      data-testid="upi-tab"
                    >
                      <Smartphone className="w-5 h-5 mr-2" />
                      UPI
                    </TabsTrigger>
                  </TabsList>

                  {/* ===== CARD TAB ===== */}
                  <TabsContent value="card" className="space-y-5 mt-0">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Card Number</label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className={`pl-11 h-12 text-base ${errors.cardNumber ? 'border-destructive ring-1 ring-destructive' : ''}`}
                          data-testid="card-number-input"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          className={`h-12 text-base ${errors.expiry ? 'border-destructive ring-1 ring-destructive' : ''}`}
                          data-testid="expiry-input"
                        />
                        {errors.expiry && (
                          <p className="text-sm text-destructive mt-1">{errors.expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">CVV</label>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                            className={`pl-11 h-12 text-base ${errors.cvv ? 'border-destructive ring-1 ring-destructive' : ''}`}
                            data-testid="cvv-input"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        {errors.cvv && (
                          <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`h-12 text-base ${errors.cardName ? 'border-destructive ring-1 ring-destructive' : ''}`}
                        data-testid="cardholder-name-input"
                      />
                      {errors.cardName && (
                        <p className="text-sm text-destructive mt-1">{errors.cardName}</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* ===== UPI TAB ===== */}
                  <TabsContent value="upi" className="space-y-5 mt-0">
                    <div>
                      <label className="block text-sm font-semibold mb-2">UPI ID</label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className={`pl-11 h-12 text-base ${errors.upiId ? 'border-destructive ring-1 ring-destructive' : ''}`}
                          data-testid="upi-id-input"
                        />
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                      {errors.upiId && (
                        <p className="text-sm text-destructive mt-1">{errors.upiId}</p>
                      )}
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">How it works:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Enter your UPI ID (e.g., name@okaxis, name@ybl)</li>
                        <li>Click "Pay Now" to initiate payment</li>
                        <li>Approve the payment request on your UPI app</li>
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <Button
                    onClick={handlePayment}
                    size="lg"
                    className="w-full rounded-full font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 h-14 text-base"
                    disabled={loading}
                    data-testid="pay-now-button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Pay ₹{booking.total_price?.toFixed?.(2) ?? booking.total_price}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full rounded-full h-12"
                    disabled={loading}
                    data-testid="cancel-payment-button"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary — Right */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel</span>
                    <span className="font-semibold text-right max-w-[180px] truncate">
                      {booking.hotel_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-semibold">{booking.check_in}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-semibold">{booking.check_out}</span>
                  </div>
                  {booking.guest_first_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guest</span>
                      <span className="font-semibold">
                        {booking.guest_first_name} {booking.guest_last_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-primary">
                      ₹{booking.total_price?.toFixed?.(2) ?? booking.total_price}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/10 p-3 rounded-xl text-sm text-accent flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>This is a demo payment gateway. No real charges will be made.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;