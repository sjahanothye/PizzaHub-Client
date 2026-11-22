'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchApi } from '../lib/api';
import {
  Pizza,
  Flame,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Star,
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  Truck,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Classic Pizzas',
    icon: '🍕',
    description: 'Timeless Italian recipes with wood-fired mozzarella and basil',
    count: '12+ Varieties',
  },
  {
    name: 'Vegetarian Pizzas',
    icon: '🌿',
    description: 'Farm-fresh veggies, artichoke hearts, and aromatic herbs',
    count: '8+ Varieties',
  },
  {
    name: 'Meat Lovers',
    icon: '🥓',
    description: 'Crispy cupping pepperoni, smoked bacon, and sausage',
    count: '10+ Varieties',
  },
  {
    name: 'Specialty / Gourmet Pizzas',
    icon: '🍄',
    description: 'White truffle oil, prosciutto di Parma, and gourmet cheeses',
    count: '7+ Varieties',
  },
  {
    name: 'Sides & Appetizers',
    icon: '🥖',
    description: 'Garlic butter knots, buffalo wings, and dipping sauces',
    count: '6+ Sides',
  },
  {
    name: 'Beverages & Desserts',
    icon: '🍨',
    description: 'Artisan tiramisu and Italian sparkling blood orange sodas',
    count: '5+ Sweets',
  },
];

const FAQS = [
  {
    question: 'How fast is pizza delivery across Dhaka?',
    answer:
      'Our partner artisan pizzerias bake on demand and dispatch in heated insulated thermal boxes. Deliveries to Dhanmondi, Gulshan, Banani, Uttara, Mirpur, and Bailey Road typically arrive in 30 to 45 minutes.',
  },
  {
    question: 'What payment methods are supported for customer orders?',
    answer:
      'Customers pay via Cash on Doorstep Delivery upon receiving their fresh hot pizza. There is no need to enter credit card details in advance to place food orders.',
  },
  {
    question: 'How can a restaurant or cloud kitchen join PizzaHub?',
    answer:
      "Simply sign up with a 'Vendor (Restaurant Owner)' account. Free tier vendors can immediately publish up to 3 active menu items. Upgrading to the Premium Partner plan unlocks unlimited items, a verified badge, and featured homepage spots.",
  },
  {
    question: 'Can I customize the pizza crust and size before ordering?',
    answer:
      'Yes! On each pizza\'s details page, you can choose between Regular (8"), Medium (10"), and Large (12") sizes, plus crust styles including Classic Hand-Tossed, Thin & Crispy, or Stuffed Cheese Burst.',
  },
  {
    question: 'Can I cancel an order after placing it?',
    answer:
      "Yes, you can cancel any pending order with 1 click directly from your Customer Dashboard ('My Orders') before the pizzeria accepts and prepares it.",
  },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchApi('/menu/featured');
        if (res.success && res.items) {
          setFeaturedItems(res.items);
        }
      } catch (err) {
        console.warn('Could not load featured items from server:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* 1. Hero Banner Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 px-4 bg-gradient-to-b from-pizza-100/40 via-background to-background dark:from-pizza-950/20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pizza-100 dark:bg-pizza-900/60 border border-pizza-200 dark:border-pizza-800 text-pizza-700 dark:text-pizza-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Flame className="w-4 h-4 text-pizza-600 animate-bounce" />
              <span>Authentic Wood-Fired Pizza Delivery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              Hot &amp; Fresh Pizza <br />
              <span className="bg-gradient-to-r from-pizza-600 via-tomato-500 to-amber-500 bg-clip-text text-transparent">
                Delivered to Your Door
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore culinary masterpieces crafted by top local pizzerias. Slow-fermented sourdough, imported buffalo mozzarella, and blistering hot delivery in under 30 minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="px-8 py-4 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-base shadow-xl shadow-pizza-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span>Explore Pizza Menu</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/sign-up"
                className="px-8 py-4 rounded-2xl border-2 border-border hover:border-pizza-500 bg-card/60 backdrop-blur text-foreground font-bold text-base transition-all hover:bg-muted"
              >
                Join as Vendor
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-border/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-pizza-600">30 min</p>
                <p className="text-xs text-muted-foreground font-medium">Average Delivery</p>
              </div>
              <div>
                <p className="text-2xl font-black text-pizza-600">4.9 ★</p>
                <p className="text-xs text-muted-foreground font-medium">10,000+ Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-black text-pizza-600">100%</p>
                <p className="text-xs text-muted-foreground font-medium">Artisan Fresh</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[460px] aspect-square rounded-full p-4 bg-gradient-to-tr from-pizza-500/20 via-tomato-500/10 to-amber-500/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
                alt="Wood-fired Gourmet Pizza"
                className="w-full h-full object-cover rounded-full shadow-2xl hover:rotate-6 transition-transform duration-700"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-2 -left-2 bg-card/95 backdrop-blur border border-border rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="p-2.5 bg-pizza-100 dark:bg-pizza-900/60 text-pizza-600 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Verified Taste</p>
                  <p className="text-sm font-bold text-foreground">Top Artisan Quality</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Dynamic Section 1: Featured Menu Items (at least 6 items) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Chef's Selection</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Featured Menu Items</h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Hand-picked bestsellers and award-winning recipes freshly baked upon your order.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-pizza-600 hover:text-pizza-700 transition-colors"
          >
            View Full Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.slice(0, 6).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-pizza-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pizza-600 shadow">
                      {item.category}
                    </div>
                    {item.vendor?.subscriptionPlan === 'premium' && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-black px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-current" /> Premium
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-pizza-600 transition-colors line-clamp-1">
                        {item.itemName}
                      </h3>
                      <span className="text-xl font-black text-pizza-600 shrink-0">
                        ৳{item.price}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pizza-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{item.location}</span>
                      </span>
                      <span className="font-medium text-foreground truncate max-w-[120px]">
                        By {item.vendor?.businessName || item.vendor?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    href={`/menu/${item._id}`}
                    className="w-full py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-pizza-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span>View Details &amp; Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No featured items found. Please start the server and run database seed.
          </div>
        )}
      </section>

      {/* 3. Dynamic Section 2: Pizza Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Variety &amp; Crusts</span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Explore by Category</h2>
          <p className="text-muted-foreground text-sm">
            Whether you crave authentic Neapolitan simplicity, hearty meats, or gourmet truffle toppings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Link
                href={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group block p-6 rounded-3xl border border-border bg-card hover:border-pizza-500/50 hover:shadow-xl hover:shadow-pizza-500/10 transition-all h-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl p-3 bg-pizza-100 dark:bg-pizza-950/60 rounded-2xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-pizza-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-medium text-pizza-600 dark:text-pizza-400">{cat.count}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Extra Section 1 (Required): Why Choose PizzaHub? */}
      <section className="bg-pizza-100/40 dark:bg-card/50 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">The PizzaHub Difference</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Why Choose PizzaHub?</h2>
            <p className="text-muted-foreground text-sm">
              We connect passionate pizza artisans with pizza enthusiasts. Quality without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
              <div className="p-3 bg-pizza-100 dark:bg-pizza-950/70 text-pizza-600 w-fit rounded-2xl">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Handcrafted Artisan Dough</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                48-hour cold fermented sourdough crusts crafted daily with imported Italian Tipo 00 flour.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
              <div className="p-3 bg-pizza-100 dark:bg-pizza-950/70 text-pizza-600 w-fit rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Verified Local Pizzerias</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every restaurant partner is vetted for culinary standards, ingredient authenticity, and hygiene.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
              <div className="p-3 bg-pizza-100 dark:bg-pizza-950/70 text-pizza-600 w-fit rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Heated Rapid Delivery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Delivered in temperature-controlled thermal bags so your pizza arrives steaming hot and crispy.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
              <div className="p-3 bg-pizza-100 dark:bg-pizza-950/70 text-pizza-600 w-fit rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">100% Satisfaction Guarantee</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If your order doesn't arrive hot and fresh, our friendly customer support will instantly resolve it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2: How PizzaHub Works & Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Simple 3-Step Ordering</span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">How PizzaHub Works</h2>
          <p className="text-muted-foreground text-sm">
            Ordering artisan pizza has never been smoother.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-8 rounded-3xl border border-border bg-card text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pizza-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-pizza-500/25">
              1
            </div>
            <h3 className="font-bold text-lg text-foreground">Browse Artisan Menus</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discover local pizza chefs, explore photo menus, filter by category or dietary preference.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pizza-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-pizza-500/25">
              2
            </div>
            <h3 className="font-bold text-lg text-foreground">Customize &amp; Order</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select delivery date, specify delivery address, and add special baking or slicing instructions.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pizza-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-pizza-500/25">
              3
            </div>
            <h3 className="font-bold text-lg text-foreground">Enjoy Hot &amp; Fresh</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track your order's real-time status from acceptance through baking and lightning-fast delivery.
            </p>
          </div>
        </div>

        {/* Customer Testimonials Carousel/Cards */}
        <div className="mt-20 pt-16 border-t border-border">
          <h3 className="text-2xl font-black text-center text-foreground mb-8">What Our Pizza Lovers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <div className="flex text-amber-500 gap-1">
                {'★★★★★'}
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "The Neapolitan Margherita crust is pure art! Arrived steaming hot in Dhanmondi in just 25 minutes."
              </p>
              <div className="pt-2 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                  alt="Tanvir"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">Tanvir Ahmed</p>
                  <p className="text-[10px] text-muted-foreground">Dhanmondi, Dhaka</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <div className="flex text-amber-500 gap-1">
                {'★★★★★'}
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "As a pizzeria owner, the Vendor Dashboard makes publishing pizzas and managing incoming orders effortless. Upgraded to Premium!"
              </p>
              <div className="pt-2 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=80&q=80"
                  alt="Marco"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">Marco Rossi</p>
                  <p className="text-[10px] text-muted-foreground">Bella Napoli Pizzeria</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
              <div className="flex text-amber-500 gap-1">
                {'★★★★★'}
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "Best pizza ordering experience in Dhaka! The status timeline on my customer dashboard kept me updated every step of the way."
              </p>
              <div className="pt-2 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                  alt="Sadia"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">Sadia Islam</p>
                  <p className="text-[10px] text-muted-foreground">Gulshan, Dhaka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ) Accordion */}
      <section className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Have Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm">Everything you need to know about ordering and partnering with PizzaHub.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:text-pizza-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-pizza-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
