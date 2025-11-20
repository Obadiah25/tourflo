import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home, Calendar, Wallet, Settings,
    TrendingUp, Star, Clock, MessageCircle, Users, DollarSign, ChevronRight
} from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';
import { supabase } from '../../lib/supabase';

// --- Types ---
interface Booking {
    id: string;
    time: string;
    experienceName: string;
    guestName: string;
    guestCount: number;
    totalPrice: number;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    guestPhone: string;
}

interface Review {
    id: string;
    guestName: string;
    experienceName: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
}

interface WeeklyStats {
    totalEarnings: number;
    bookings: number;
    averageBooking: number;
    trend: number;
    dailyBreakdown: { day: string; amount: number }[];
}

// --- Mock Data (Fallback) ---
const MOCK_BOOKINGS: Booking[] = [
    {
        id: '1',
        time: '9:00 AM',
        experienceName: 'Florida Keys Fishing Charter',
        guestName: 'John Smith',
        guestCount: 4,
        totalPrice: 380,
        status: 'confirmed',
        guestPhone: '+1-555-123-4567'
    },
    {
        id: '2',
        time: '11:30 AM',
        experienceName: 'Everglades Airboat Adventure',
        guestName: 'Sarah Johnson',
        guestCount: 2,
        totalPrice: 150,
        status: 'confirmed',
        guestPhone: '+1-555-987-6543'
    },
    {
        id: '3',
        time: '2:00 PM',
        experienceName: 'Miami Beach Food Tour',
        guestName: 'Mike Davis',
        guestCount: 6,
        totalPrice: 420,
        status: 'pending',
        guestPhone: '+1-555-456-7890'
    }
];

const MOCK_STATS: WeeklyStats = {
    totalEarnings: 2840,
    bookings: 12,
    averageBooking: 237,
    trend: 18,
    dailyBreakdown: [
        { day: 'Mon', amount: 420 },
        { day: 'Tue', amount: 380 },
        { day: 'Wed', amount: 520 },
        { day: 'Thu', amount: 460 },
        { day: 'Fri', amount: 590 },
        { day: 'Sat', amount: 340 },
        { day: 'Sun', amount: 130 }
    ]
};

const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        guestName: 'Emily Rodriguez',
        experienceName: 'Florida Keys Fishing Charter',
        rating: 5,
        comment: 'Amazing experience! Captain Mike was fantastic and we caught so many fish. Highly recommend!',
        date: '2 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    {
        id: '2',
        guestName: 'David Thompson',
        experienceName: 'Everglades Airboat Tour',
        rating: 5,
        comment: 'Absolutely thrilling! Saw alligators up close and the guide was very knowledgeable.',
        date: '5 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    },
    {
        id: '3',
        guestName: 'Lisa Chen',
        experienceName: 'Miami Beach Food Tour',
        rating: 4,
        comment: 'Great food tour! Would have loved more time at each stop but overall excellent.',
        date: '1 day ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
    }
];

export default function OperatorDashboardSimple() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Header />

            <div className="flex-1 overflow-y-auto pb-20">
                {activeTab === 'dashboard' && <DashboardContent />}
                {activeTab === 'bookings' && <div className="p-6 text-gray-600">Bookings Management (Coming Soon)</div>}
                {activeTab === 'earnings' && <div className="p-6 text-gray-600">Full Earnings Detail (Coming Soon)</div>}
                {activeTab === 'settings' && <div className="p-6 text-gray-600">Settings (Coming Soon)</div>}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

function Header() {
    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
                <img src="/logos/tourflo-black.png" alt="TourFlo Operator" className="h-8" />
                <p className="text-xs text-gray-500 mt-1">Operator Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    VERIFIED
                </div>
                <button className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0" />
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🔔</span>
                    </div>
                </button>
            </div>
        </div>
    );
}

function DashboardContent() {
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [stats, setStats] = useState<WeeklyStats>(MOCK_STATS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

    useEffect(() => {
        // In a real app, we would fetch from Supabase here
        // For now, we'll just use the mock data which is already set as initial state

        const fetchRealData = async () => {
            // Example fetch logic (commented out until backend is ready)
            /*
            const { data, error } = await supabase.from('bookings').select('*').eq('date', new Date().toISOString().split('T')[0]);
            if (data) setBookings(data);
            */
        };

        fetchRealData();
    }, []);

    return (
        <div className="space-y-6 p-6">
            <WelcomeBanner />
            <TodaysBookingsCard bookings={bookings} />
            <EarningsThisWeekCard stats={stats} />
            <RecentReviewsCard reviews={reviews} />
        </div>
    );
}

function WelcomeBanner() {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
            <p className="text-white/90 text-lg">Florida Adventure Tours</p>
            <p className="text-white/70 text-sm mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
    );
}

function TodaysBookingsCard({ bookings }: { bookings: Booking[] }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Today's Bookings</h2>
                    <p className="text-sm text-gray-500">{bookings.length} tours scheduled</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
                    ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)} Total
                </div>
            </div>

            <div className="space-y-3">
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No bookings today</p>
                        <p className="text-gray-400 text-sm mt-1">New bookings will appear here</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <motion.div
                            key={booking.id}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                        >
                            <div className="p-4">
                                {/* Header: Time + Status */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="font-bold text-lg text-gray-900">{booking.time}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </div>
                                </div>

                                {/* Experience Name */}
                                <h3 className="font-bold text-gray-900 mb-2 text-base">{booking.experienceName}</h3>

                                {/* Guest Info */}
                                <div className="flex items-center gap-4 mb-3 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span className="font-medium">{booking.guestName}</span>
                                    </div>
                                    <div className="text-gray-500">•</div>
                                    <div className="text-gray-600">
                                        {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="text-lg font-bold text-green-600">${booking.totalPrice} USD</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <motion.a
                                        href={`https://wa.me/${booking.guestPhone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </motion.a>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        Details
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

function EarningsThisWeekCard({ stats }: { stats: WeeklyStats }) {
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="text-sm opacity-90 mb-1">Earnings This Week</div>
                    <div className="text-5xl font-bold mb-2">${stats.totalEarnings}</div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                        <TrendingUp className="w-4 h-4" />
                        <span>+{stats.trend}% vs last week</span>
                    </div>
                </div>
                <Wallet className="w-10 h-10 opacity-80" />
            </div>

            <div className="border-t border-white/20 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="text-xs opacity-70 mb-1">Total Bookings</div>
                        <div className="text-2xl font-bold">{stats.bookings}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-70 mb-1">Avg. per Booking</div>
                        <div className="text-2xl font-bold">${stats.averageBooking}</div>
                    </div>
                </div>

                {/* Simple bar chart */}
                <div className="flex items-end justify-between gap-1.5 h-16">
                    {stats.dailyBreakdown.map((day, idx) => {
                        const maxAmount = Math.max(...stats.dailyBreakdown.map(d => d.amount));
                        const height = (day.amount / maxAmount) * 100;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-white/30 rounded-t-lg" style={{ height: `${height}%` }} />
                                <span className="text-[10px] opacity-70">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white/20 backdrop-blur-sm text-white font-bold py-3 rounded-xl mt-4 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
                View Full Earnings
                <ChevronRight className="w-4 h-4" />
            </motion.button>
        </div>
    );
}

function RecentReviewsCard({ reviews }: { reviews: Review[] }) {
    const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recent Reviews</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(parseFloat(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">{averageRating} average</span>
                    </div>
                </div>
                <button className="text-sm font-medium text-blue-600 flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No reviews yet</p>
                        <p className="text-gray-400 text-sm mt-1">Reviews from guests will appear here</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex gap-3">
                                {/* Avatar */}
                                <img
                                    src={review.avatar}
                                    alt={review.guestName}
                                    className="w-12 h-12 rounded-full bg-gray-100"
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.guestName}</h4>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.comment}</p>
                                    <p className="text-xs text-gray-500 font-medium">{review.experienceName}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    const tabs = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'bookings', icon: Calendar, label: 'Bookings' },
        { id: 'earnings', icon: Wallet, label: 'Earnings' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-3">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            triggerHaptic('light');
                        }}
                        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-50' : ''
                            }`}
                    >
                        <tab.icon
                            className={`w-6 h-6 transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                                }`}
                        />
                        <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
