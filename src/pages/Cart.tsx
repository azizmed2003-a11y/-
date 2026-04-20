import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { COUPONS, SHIPPING_RULES } from '../constants';

export default function Cart() {
  const { 
    cart, removeFromCart, updateQuantity, subtotal, 
    shipping, discount, total, appliedCoupon, applyCoupon 
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      setCouponCode('');
    } else {
      alert('Invalid coupon or minimum spend not met');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-gray-200" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-shadow">
              <Link to={`/product/${item.id}`} className="shrink-0 aspect-[3/4] w-28 overflow-hidden rounded-xl">
                <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </Link>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${item.id}`} className="text-xl font-bold text-gray-900 hover:text-orange-500">
                      {item.name}
                    </Link>
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-gray-900">
                      ${(item.salePrice || item.price) * item.quantity}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      ${item.salePrice || item.price} / each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center space-x-2 text-gray-500 hover:text-orange-500 font-bold group"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-2xl font-black mb-8 italic tracking-tighter">Summary</h3>
            
            <div className="space-y-4 text-sm">
              {(shipping > 0 || discount > 0) && (
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-orange-400 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-4xl font-black text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl mt-10 flex items-center justify-center space-x-3 transition-colors shadow-lg shadow-orange-500/20"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>
          </div>

          <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-orange-500" />
              <span>Apply Coupon</span>
            </h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
              <button 
                onClick={handleApplyCoupon}
                className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Try "BOOK10" for 10% off</p>
          </div>
        </div>
      </div>
    </div>
  );
}
