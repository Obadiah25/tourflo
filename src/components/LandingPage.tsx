import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Anchor,
    Ship,
    Palmtree,
    Wind,
    History,
    Waves,
    Sunset,
    Footprints,
    Compass,
    Users,
    Star,
    CheckCircle,
    ShieldCheck,
    MessageCircle,
    DollarSign,
    TrendingUp,
    Smartphone,
    Globe,
    Menu,
    X,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { FLORIDA_CATEGORIES } from '../constants/categories';

interface LandingPageProps {
    onNavigate: (screen: 'auth' | 'operator' | 'main') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
    const [userType, setUserType] = useState<'tourist' | 'operator'>('tourist');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="h-screen overflow-y-auto overflow-x-hidden bg-white font-sans text-gray-900">
            {/* === HEADER === */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0077BE] to-[#00A3FF] rounded-xl flex items-center justify-center shadow-lg">
                                <Anchor className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0077BE] to-[#004E7C]" style={{ fontFamily: 'Poppins' }}>
                                TourFlo
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <button onClick={() => onNavigate('main')} className="text-gray-600 hover:text-[#0077BE] font-medium transition-colors">
                                Browse Experiences
                            </button>
                            <button onClick={() => { setUserType('operator'); scrollToSection('operator-hero'); }} className="text-gray-600 hover:text-[#0077BE] font-medium transition-colors">
                                For Operators
                            </button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <button
                                onClick={() => onNavigate('auth')}
                                className="text-[#0077BE] font-semibold hover:text-[#005A8F] transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => onNavigate('auth')}
                                className="bg-[#0077BE] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#00629E] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                        >
                            <div className="px-4 py-6 space-y-4">
                                <button onClick={() => onNavigate('main')} className="block w-full text-left text-lg font-medium text-gray-900">
                                    Browse Experiences
                                </button>
                                <button onClick={() => { setUserType('operator'); scrollToSection('operator-hero'); }} className="block w-full text-left text-lg font-medium text-gray-900">
                                    For Operators
                                </button>
                                <hr className="border-gray-100" />
                                <button onClick={() => onNavigate('auth')} className="block w-full text-left text-lg font-medium text-[#0077BE]">
                                    Sign In
                                </button>
                                <button onClick={() => onNavigate('auth')} className="w-full bg-[#0077BE] text-white py-3 rounded-xl font-semibold">
                                    Get Started
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* === HERO SECTION === */}
            <section className="pt-20 relative overflow-hidden">
                {/* Toggle Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex justify-center">
                    <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative">
                        <motion.div
                            className="absolute inset-y-1.5 bg-white rounded-full shadow-sm"
                            initial={false}
                            animate={{
                                left: userType === 'tourist' ? '6px' : '50%',
                                right: userType === 'tourist' ? '50%' : '6px',
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setUserType('tourist')}
                            className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${userType === 'tourist' ? 'text-[#0077BE]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            I'm a Tourist
                        </button>
                        <button
                            onClick={() => setUserType('operator')}
                            className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${userType === 'operator' ? 'text-[#0077BE]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            I'm an Operator
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {userType === 'tourist' ? (
                        <TouristHero key="tourist" onNavigate={onNavigate} />
                    ) : (
                        <OperatorHero key="operator" onNavigate={onNavigate} />
                    )}
                </AnimatePresence>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#0077BE] font-bold tracking-wider text-sm uppercase">Simple. Transparent. Works.</span>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
                            How TourFlo Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                        {/* Tourist Flow */}
                        <div className="relative">
                            <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-200 md:hidden"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#0077BE] text-white rounded-full flex items-center justify-center text-sm">T</span>
                                For Tourists
                            </h3>
                            <div className="space-y-12">
                                <Step
                                    number={1}
                                    title="Browse by Category"
                                    desc="Find exactly what you're looking for, from fishing charters to sunset cruises."
                                    icon={Compass}
                                />
                                <Step
                                    number={2}
                                    title="Discover Authenticity"
                                    desc="See real photos, verified reviews, and meet your local guide before you book."
                                    icon={Users}
                                />
                                <Step
                                    number={3}
                                    title="Book Instantly"
                                    desc="Secure your spot in seconds with safe, easy payment options."
                                    icon={CheckCircle}
                                />
                                <Step
                                    number={4}
                                    title="Enjoy the Experience"
                                    desc="Get instant confirmation and direct communication with your operator."
                                    icon={Sunset}
                                />
                            </div>
                        </div>

                        {/* Operator Flow */}
                        <div className="relative">
                            <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-200 md:hidden"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm">O</span>
                                For Operators
                            </h3>
                            <div className="space-y-12">
                                <Step
                                    number={1}
                                    title="Sign Up in Seconds"
                                    desc="Create your account and verify your business identity quickly."
                                    icon={Smartphone}
                                    color="orange"
                                />
                                <Step
                                    number={2}
                                    title="List Your Tours"
                                    desc="Add photos, pricing, and availability. We make it look beautiful."
                                    icon={Ship}
                                    color="orange"
                                />
                                <Step
                                    number={3}
                                    title="Go Live"
                                    desc="Your experiences are instantly available to thousands of tourists."
                                    icon={Globe}
                                    color="orange"
                                />
                                <Step
                                    number={4}
                                    title="Get Paid Directly"
                                    desc="Money goes straight to your bank account. No waiting, no commission fees."
                                    icon={DollarSign}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === BROWSE CATEGORIES === */}
            <section className="py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                                Explore Florida
                            </h2>
                            <p className="text-gray-600 text-lg">Find the perfect experience for your vacation.</p>
                        </div>
                        <button onClick={() => onNavigate('main')} className="hidden md:flex items-center gap-2 text-[#0077BE] font-semibold hover:gap-3 transition-all">
                            View All Categories <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {FLORIDA_CATEGORIES.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} onClick={() => onNavigate('main')} />
                        ))}
                    </div>

                    <button onClick={() => onNavigate('main')} className="md:hidden w-full mt-4 flex items-center justify-center gap-2 text-[#0077BE] font-semibold">
                        View All Categories <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* === VALUE PROPS === */}
            <section className="py-20 bg-[#0077BE] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
                            Why Tourists Choose TourFlo
                        </h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            We're not just a booking platform. We're your connection to the real Florida.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={Star}
                            title="Authentic Experiences"
                            desc="Discovered by locals, not corporate packages. Find the hidden gems."
                        />
                        <FeatureCard
                            icon={Smartphone}
                            title="Instant Booking"
                            desc="Reserve your spot in seconds. No back-and-forth emails."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Real Reviews"
                            desc="Verified reviews from real tourists, complete with photos."
                        />
                        <FeatureCard
                            icon={MessageCircle}
                            title="Direct Contact"
                            desc="Chat directly with your guide or operator before and after booking."
                        />
                    </div>
                </div>
            </section>

            {/* === OPERATOR VALUE PROPS === */}
            <section id="operator-hero" className="py-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF6B35]/10 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#FF6B35] font-bold tracking-wider text-sm uppercase mb-4 block">For Operators</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
                                Keep Your Hard-Earned Money.
                            </h2>
                            <p className="text-gray-300 text-lg mb-8">
                                Stop paying 20-30% commissions. With TourFlo, you pay a flat monthly fee and keep 100% of your bookings.
                            </p>

                            <div className="space-y-6 mb-10">
                                <OperatorFeature
                                    title="Zero Commissions"
                                    desc="Save thousands per year compared to other platforms."
                                />
                                <OperatorFeature
                                    title="Direct Payments"
                                    desc="Get paid instantly via Stripe. No 30-day holding periods."
                                />
                                <OperatorFeature
                                    title="You Own the Customer"
                                    desc="Build direct relationships. We don't hide customer data."
                                />
                            </div>

                            <button
                                onClick={() => onNavigate('operator')}
                                className="bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#E55A2B] transition-all hover:scale-105"
                            >
                                Start Your Free Trial
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6 text-center">Annual Cost Comparison</h3>
                            <div className="space-y-4">
                                <ComparisonRow platform="FareHarbor" cost="$6,000+" fee="6% fee" />
                                <ComparisonRow platform="Rezdy" cost="$4,200+" fee="2% + fees" />
                                <ComparisonRow platform="Viator" cost="$15,000+" fee="25% comm" />
                                <div className="bg-[#0077BE] rounded-xl p-4 transform scale-105 shadow-xl border border-blue-400">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-1.5 rounded-lg">
                                                <Anchor className="w-5 h-5 text-[#0077BE]" />
                                            </div>
                                            <span className="font-bold text-lg">TourFlo</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl">$1,200</div>
                                            <div className="text-xs text-blue-200">FLAT FEE</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-blue-400/50 text-center text-sm font-medium text-blue-100">
                                        YOU SAVE $5,000 - $15,000+ / YEAR
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === PRICING === */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                            Transparent Pricing
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Choose the plan that fits your business. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <PricingCard
                            title="Starter"
                            price="49"
                            features={[
                                "Up to 3 experiences",
                                "20 bookings/month",
                                "Basic analytics",
                                "Standard support"
                            ]}
                            onSelect={() => onNavigate('operator')}
                        />
                        <PricingCard
                            title="Growth"
                            price="99"
                            isPopular
                            features={[
                                "Up to 10 experiences",
                                "Unlimited bookings",
                                "Advanced analytics",
                                "Team member access",
                                "Priority support"
                            ]}
                            onSelect={() => onNavigate('operator')}
                        />
                        <PricingCard
                            title="Pro"
                            price="249"
                            features={[
                                "Unlimited experiences",
                                "Unlimited bookings",
                                "Custom analytics",
                                "API Access",
                                "Dedicated account manager"
                            ]}
                            onSelect={() => onNavigate('operator')}
                        />
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-500">
                            All plans come with a 14-day free trial. No credit card required to start.
                        </p>
                    </div>
                </div>
            </section>

            {/* === FAQ === */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" style={{ fontFamily: 'Poppins' }}>
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        <FAQItem
                            question="Is my payment secure?"
                            answer="Yes, absolutely. We use Stripe, the industry standard for online payments. Your financial data is encrypted and never stored on our servers."
                        />
                        <FAQItem
                            question="Can I cancel my booking?"
                            answer="Cancellation policies vary by operator, but are clearly displayed before you book. Most operators offer full refunds up to 24 hours before the experience."
                        />
                        <FAQItem
                            question="How do operators get paid?"
                            answer="Operators connect their bank accounts directly via Stripe Connect. Payouts are automatic and typically arrive within 2 business days."
                        />
                        <FAQItem
                            question="Is there a contract for operators?"
                            answer="No long-term contracts. You can cancel your subscription at any time. We believe in earning your business every month."
                        />
                    </div>
                </div>
            </section>

            {/* === FOOTER === */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#0077BE] to-[#00A3FF] rounded-lg flex items-center justify-center">
                                    <Anchor className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>TourFlo</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Connecting travelers with authentic Florida experiences. Supporting local operators with fair, transparent tools.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-lg">Company</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-lg">Discover</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><button onClick={() => onNavigate('main')} className="hover:text-white transition-colors">Browse Experiences</button></li>
                                <li><button onClick={() => onNavigate('main')} className="hover:text-white transition-colors">Categories</button></li>
                                <li><button onClick={() => onNavigate('main')} className="hover:text-white transition-colors">Featured Operators</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-lg">Operators</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><button onClick={() => onNavigate('operator')} className="hover:text-white transition-colors">List Your Tours</button></li>
                                <li><button onClick={() => onNavigate('operator')} className="hover:text-white transition-colors">Pricing</button></li>
                                <li><button onClick={() => onNavigate('operator')} className="hover:text-white transition-colors">Operator Login</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2025 TourFlo Inc. All rights reserved.</p>
                        <div className="flex gap-6 text-gray-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- Subcomponents ---

function TouristHero({ onNavigate }: { onNavigate: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center"
        >
            <div>
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#0077BE] font-semibold rounded-full text-sm mb-6">
                    🌴 Explore the Real Florida
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
                    Book Authentic <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077BE] to-[#00A3FF]">
                        Florida Experiences
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    From sunrise fishing charters to sunset cruises. Discover hidden gems, book instantly, and explore like a local.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onNavigate('main')}
                        className="bg-[#0077BE] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#00629E] transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Compass className="w-5 h-5" />
                        Browse Experiences
                    </button>
                    <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Download App
                    </button>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077BE]/20 to-transparent rounded-3xl transform rotate-3"></div>
                <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
                    alt="Florida Fishing"
                    className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-subtle">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">Verified Operators</p>
                        <p className="text-sm text-gray-500">100% Licensed & Insured</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function OperatorHero({ onNavigate }: { onNavigate: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center"
        >
            <div>
                <div className="inline-block px-4 py-1.5 bg-orange-50 text-[#FF6B35] font-semibold rounded-full text-sm mb-6">
                    🚀 Grow Your Business
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
                    Get Booked. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B]">
                        Keep All Your Money.
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Stop bleeding commissions. List your tours for a flat monthly fee. Get discovered by thousands of tourists.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onNavigate('operator')}
                        className="bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#E55A2B] transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        List Your Tours
                    </button>
                    <div className="flex items-center gap-2 px-4 text-gray-500 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        No credit card required
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 to-transparent rounded-3xl transform -rotate-3"></div>
                <img
                    src="https://images.unsplash.com/photo-1552858725-2758b5fb1286?q=80&w=2070&auto=format&fit=crop"
                    alt="Tour Operator"
                    className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute top-6 -right-6 bg-white p-4 rounded-xl shadow-xl">
                    <p className="text-sm text-gray-500 mb-1">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium mt-1">
                        <TrendingUp className="w-4 h-4" />
                        +18% this month
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Step({ number, title, desc, icon: Icon, color = 'blue' }: any) {
    const bgClass = color === 'blue' ? 'bg-blue-50 text-[#0077BE]' : 'bg-orange-50 text-[#FF6B35]';

    return (
        <div className="flex gap-6 relative">
            <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CategoryCard({ category, onClick }: any) {
    const Icon = category.icon;
    return (
        <button
            onClick={onClick}
            className="flex-shrink-0 w-48 group cursor-pointer text-left"
        >
            <div className="w-48 h-64 rounded-2xl overflow-hidden relative mb-3 shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-2">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-lg">{category.name}</p>
                </div>
            </div>
        </button>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <div className="w-12 h-12 bg-white text-[#0077BE] rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-blue-100 leading-relaxed">{desc}</p>
        </div>
    );
}

function OperatorFeature({ title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{title}</h4>
                <p className="text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function ComparisonRow({ platform, cost, fee }: any) {
    return (
        <div className="flex justify-between items-center p-4 border-b border-white/10 text-gray-300">
            <span className="font-medium">{platform}</span>
            <div className="text-right">
                <div className="text-white font-bold">{cost}</div>
                <div className="text-xs opacity-70">{fee}</div>
            </div>
        </div>
    );
}

function PricingCard({ title, price, features, isPopular, onSelect }: any) {
    return (
        <div className={`bg-white rounded-2xl p-8 shadow-xl border ${isPopular ? 'border-[#FF6B35] ring-4 ring-[#FF6B35]/10 relative' : 'border-gray-100'}`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    Most Popular
                </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">${price}</span>
                <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onSelect}
                className={`w-full py-3 rounded-xl font-bold transition-all ${isPopular
                    ? 'bg-[#FF6B35] text-white hover:bg-[#E55A2B] shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
            >
                Get Started
            </button>
        </div>
    );
}

function FAQItem({ question, answer }: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-gray-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 px-4 pb-4"
                    >
                        <p className="text-gray-600 pt-2 border-t border-gray-100">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
