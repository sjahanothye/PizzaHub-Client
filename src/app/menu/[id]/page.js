'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import {
  MapPin,
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Calendar,
  Home,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Store,
  AlertTriangle,
} from 'lucide-react';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isCustomer, isVendor, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Optional Feature 1: Reviews
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Optional Feature 4: Wishlist / Favorite
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadItemDetails();
    loadReviews();
    if (isAuthenticated && isCustomer) {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated]);

  const loadItemDetails = async () => {
    try {
      const res = await fetchApi(`/menu/${id}`);
      if (res.success && res.item) {
        setItem(res.item);
      }
    } catch (err) {
      console.warn('Failed to load item:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await fetchApi(`/reviews/item/${id}`);
      if (res.success) {
        setReviews(res.reviews || []);
        setAverageRating(res.averageRating || 5);
      }
    } catch (err) {
      console.warn('Failed to load reviews:', err.message);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetchApi('/favorites');
      if (res.success && res.favoriteIds) {
        setIsFavorite(res.favoriteIds.includes(id));
      }
    } catch (err) {
      // quiet catch
    }
  };

  const toggleFavoriteHandler = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your wishlist!');
      router.push(`/sign-in?redirect=/menu/${id}`);
      return;
    }
    try {
      const res = await fetchApi('/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ itemId: id }),
      });
      if (res.success) {
        setIsFavorite(res.isFavorite);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error('Failed to update favorites.');
    }
  };

  const handleOpenOrderModal = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in with your customer account to place an order.');
      router.push(`/sign-in?redirect=/menu/${id}`);
      return;
    }

    if (isAdmin) {
      toast.error('Admins cannot place customer food orders.');
      return;
    }

    if (isVendor && item?.vendorId === user?._id) {
      toast.error('Vendors cannot order their own menu items.');
      return;
    }

    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);

    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryDate || !deliveryAddress) {
      toast.error('Please specify both delivery date and delivery address.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const res = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          itemId: id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });

      if (res.success) {
        toast.success('Order placed successfully! 🍕 Check your Customer Dashboard to track status.');
        setOrderModalOpen(false);
        router.push('/dashboard/customer/orders');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          itemId: id,
          rating: newRating,
          comment: newComment,
        }),
      });

      if (res.success) {
        toast.success('Review posted successfully!');
        setNewComment('');
        loadReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to post review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-pizza-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Preparing fresh pizza details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Pizza Item Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested menu item could not be located or may have been removed.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pizza-600 text-white text-sm font-semibold hover:bg-pizza-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse Menu
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-pizza-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse Menu
        </Link>
      </div>

      {/* Main Grid: Gallery + Item Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-border bg-muted shadow-lg">
            <img
              src={images[selectedImage]}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-bold text-pizza-600 shadow-md">
              {item.category}
            </div>
            {item.vendor?.subscriptionPlan === 'premium' && (
              <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Premium Partner
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-pizza-600 scale-105 shadow-md' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Details & Order Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">{item.category}</span>
              {/* Wishlist Button (Optional 4) */}
              <button
                onClick={toggleFavoriteHandler}
                className="p-2.5 rounded-2xl border border-border hover:bg-muted text-muted-foreground transition-all hover:scale-105"
                title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'text-tomato-500 fill-tomato-500' : 'hover:text-tomato-500'
                  }`}
                />
              </button>
            </div>

            <h1 className="text-3xl font-black text-foreground">{item.itemName}</h1>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-3xl font-black text-pizza-600">${item.price?.toFixed(2)}</span>
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{averageRating} / 5</span>
                <span className="text-muted-foreground font-normal">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

          {/* Restaurant / Vendor Info Card */}
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 rounded-xl">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Bakehouse &amp; Kitchen</p>
                <p className="text-sm font-bold text-foreground">
                  {item.vendor?.businessName || item.vendor?.name || 'Local Artisan Pizzeria'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-pizza-600" />
                {item.location}
              </span>
            </div>
          </div>

          {/* Order CTA Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleOpenOrderModal}
              className="w-full py-4 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-base shadow-xl shadow-pizza-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order Now for Delivery</span>
            </button>

            {/* Note regarding cash / direct checkout as per requirement */}
            <p className="text-[11px] text-center text-muted-foreground">
              Instant order placement. Pay upon hot doorstep delivery. No advance card required.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section (Optional Requirement 1) */}
      <section className="pt-10 border-t border-border space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Customer Reviews &amp; Ratings</h2>
            <p className="text-xs text-muted-foreground">
              Read authentic feedback from foodies who ordered this pizza.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-muted'}`}
                />
              ))}
            </div>
            <span className="text-base font-bold text-foreground">{averageRating} out of 5</span>
          </div>
        </div>

        {/* Submit Review Form (Customer only) */}
        {isAuthenticated && isCustomer && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4 max-w-xl"
          >
            <h3 className="font-bold text-sm">Write a Review</h3>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Your Review</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with the crust, sauce, flavor, and delivery..."
                rows={3}
                className="w-full p-3 rounded-2xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {submittingReview ? 'Posting Review...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customer?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                      alt={rev.customer?.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-foreground">{rev.customer?.name}</span>
                  </div>
                  <div className="flex text-amber-500 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-muted-foreground block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground col-span-2">
              No reviews yet. Be the first to share your thoughts on this pizza!
            </p>
          )}
        </div>
      </section>

      {/* Order Submission Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Confirm Pizza Order</h3>
                <p className="text-xs text-muted-foreground">Fresh delivery from {item.vendor?.businessName || item.vendor?.name}</p>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Selected item summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted">
              <img src={images[0]} alt={item.itemName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-foreground">{item.itemName}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <span className="text-base font-black text-pizza-600">${item.price?.toFixed(2)}</span>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pizza-600" />
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-pizza-600" />
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  placeholder="Street address, apartment/suite number, city, and zip code..."
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-pizza-600" />
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  placeholder="E.g. Extra crispy crust, please do not ring doorbell"
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-6 py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-xs font-bold shadow-lg shadow-pizza-500/20 disabled:opacity-50 transition-all hover:scale-105"
                >
                  {submittingOrder ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
