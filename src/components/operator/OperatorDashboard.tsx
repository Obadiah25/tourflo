import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Calendar, Grid3x3, Wallet,
  TrendingUp, Star, Clock, ChevronRight, Plus, QrCode,
  Settings, MessageCircle, Users, UserCheck, AlertTriangle, X, CloudRain,
  Check, Clipboard
} from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';
import InventoryStatus from './InventoryStatus';
import GuideManagement from './GuideManagement';
import InventoryManagement from './InventoryManagement';
import EarningsDashboard from './EarningsDashboard';

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isPending = false;

  if (isPending) {
    return <PendingState />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'tours' && <InventoryManagement />}
        {activeTab === 'guides' && <GuideManagement />}
        {activeTab === 'earnings' && <EarningsDashboard />}
        {activeTab === 'settings' && <div className="p-6">Settings Content</div>}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <img src="/logos/tourflo-black.png" alt="TourFlo" className="h-8" />
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
          PRO
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
  const [showWeatherAlert, setShowWeatherAlert] = useState(true);

  const weatherAlert = {
    severity: 'high',
    condition: 'Heavy Rain',
    timeRange: '2:00 PM - 4:00 PM',
    affectedTours: 3,
    message: 'Outdoor tours may need to be rescheduled'
  };

  return (
    <div className="space-y-5 p-6">
      {showWeatherAlert && (
        <WeatherAlertBanner
          alert={weatherAlert}
          onDismiss={() => setShowWeatherAlert(false)}
        />
      )}
      <TodaysTours />
      <InventoryStatus />
      <QuickActions />
      <RevenueCard />
      <YourTeam />
    </div>
  );
}

function TodaysTours() {
  const tours = [
    {
      id: '1',
      time: '9:00 AM',
      name: 'Everglades Airboat Adventure',
      guide: { name: 'Mike Rodriguez', assigned: true },
      capacity: { current: 4, max: 6 },
      waitlist: 1,
      special: 'Wheelchair accessible required',
      status: 'confirmed'
    },
    {
      id: '2',
      time: '11:30 AM',
      name: 'Miami Beach Food Tour',
      guide: { name: 'Sarah Martinez', assigned: true },
      capacity: { current: 8, max: 8 },
      waitlist: 0,
      special: null,
      status: 'confirmed'
    },
    {
      id: '3',
      time: '2:00 PM',
      name: 'Key West Sunset Cruise',
      guide: { name: null, assigned: false },
      capacity: { current: 3, max: 10 },
      waitlist: 0,
      special: 'Dietary restrictions: 2 vegan',
      status: 'pending'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Tours</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-florida-ocean text-white rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-3">
        {tours.map((tour) => {
          const spotsLeft = tour.capacity.max - tour.capacity.current;
          const isFull = spotsLeft === 0;

          return (
            <motion.div
              key={tour.id}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-lg text-gray-900">{tour.time}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{tour.name}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    tour.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tour.status}
                  </div>
                </div>

                {tour.guide.assigned ? (
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Guide: <span className="font-medium text-gray-900">{tour.guide.name}</span></span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-3 bg-red-50 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700 font-medium">No guide assigned</span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className={`flex items-center gap-1.5 ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{tour.capacity.current}/{tour.capacity.max} booked</span>
                  </div>
                  {tour.waitlist > 0 && (
                    <div className="flex items-center gap-1.5 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Waitlist: {tour.waitlist}</span>
                    </div>
                  )}
                </div>

                {tour.special && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-start gap-2">
                      <Clipboard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-800">{tour.special}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Check-in
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl py-4 flex items-center justify-center gap-2 text-gray-600 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Tour
        </motion.button>
      </div>
    </div>
  );
}

function StatsCarousel() {
  const stats = [
    {
      label: "Today's Bookings",
      value: '8',
      subtitle: '2 pending check-in',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'This Month Revenue',
      value: '$4,250',
      subtitle: '+23% vs last month',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Active Experiences',
      value: '5/10',
      subtitle: 'Add 5 more',
      icon: Grid3x3,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Your Rating',
      value: '4.9',
      subtitle: 'From 124 reviews',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div>
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="min-w-[280px] snap-center"
          >
            <div className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <stat.icon className="w-8 h-8 opacity-80" />
                <ChevronRight className="w-6 h-6 opacity-60" />
              </div>
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
              <div className="text-xs opacity-70 mt-1">{stat.subtitle}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {stats.map((_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  );
}

function TodaysSchedule() {
  const bookings = [
    {
      time: '9:00 AM',
      experience: 'Dunn\'s River Falls Climb',
      guest: 'John Smith',
      guests: 4,
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      time: '11:30 AM',
      experience: 'Blue Mountain Coffee Tour',
      guest: 'Sarah Johnson',
      guests: 2,
      status: 'pending',
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      time: '2:00 PM',
      experience: 'Luminous Lagoon Night Tour',
      guest: 'Mike Davis',
      guests: 6,
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/3851256/pexels-photo-3851256.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {bookings.map((booking, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="min-w-[320px] snap-center"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-48">
              <img
                src={booking.image}
                alt={booking.experience}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.time}
              </div>

              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'confirmed'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-gray-900'
                }`}>
                  {booking.status}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-2">{booking.experience}</h3>
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {booking.guest}
                  </div>
                  <div>• {booking.guests} guests</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExperiencesSection() {
  const experiences = [
    {
      title: 'Dunn\'s River Falls Climb',
      bookings: 24,
      revenue: '$1,200',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400',
      active: true
    },
    {
      title: 'Blue Mountain Coffee Tour',
      bookings: 18,
      revenue: '$900',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400',
      active: true
    },
    {
      title: 'Luminous Lagoon Night Tour',
      bookings: 31,
      revenue: '$1,550',
      rating: 5.0,
      image: 'https://images.pexels.com/photos/3851256/pexels-photo-3851256.jpeg?auto=compress&cs=tinysrgb&w=400',
      active: true
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Experiences</h2>
          <p className="text-sm text-gray-500">3 active • 5 slots remaining</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="min-w-[85vw] snap-center"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-64">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <Settings className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-2xl mb-3">{exp.title}</h3>
                <div className="flex gap-2">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.bookings} bookings
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {exp.revenue}
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {exp.rating}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="min-w-[85vw] snap-center"
        >
          <div className="h-64 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 font-medium">Add Experience</p>
              <p className="text-gray-400 text-sm mt-1">5 slots remaining</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GuidesSection() {
  const guides = [
    {
      name: 'Mike Rodriguez',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      tours: 24,
      rating: 4.9,
      available: true
    },
    {
      name: 'Sarah Martinez',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      tours: 18,
      rating: 5.0,
      available: true
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Guides</h2>
          <p className="text-sm text-gray-500">{guides.length} active guides</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-florida-ocean text-white rounded-full flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {guides.map((guide, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="min-w-[200px] snap-center"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="relative h-48">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 right-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    guide.available
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-1" />
                    {guide.available ? 'Online' : 'Offline'}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-base mb-1">{guide.name}</h3>
                  <div className="flex items-center justify-between text-white/90 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {guide.tours} tours
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {guide.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RevenueCard() {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm opacity-90 mb-1">This Month</div>
          <div className="text-4xl font-bold mb-1">$4,250</div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+23% vs last month</span>
          </div>
        </div>
        <Wallet className="w-10 h-10 opacity-80" />
      </div>

      <div className="border-t border-white/20 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs opacity-70 mb-1">Today</div>
            <div className="text-xl font-bold">$340</div>
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Pending</div>
            <div className="text-xl font-bold">$180</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YourTeam() {
  const guides = [
    {
      name: 'Mike Rodriguez',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      tours: 3,
      status: 'active'
    },
    {
      name: 'Sarah Martinez',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      tours: 2,
      status: 'active'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Team</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerHaptic('light')}
          className="text-sm font-medium text-florida-ocean flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {guides.map((guide, idx) => (
          <motion.div
            key={idx}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={guide.photo}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{guide.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{guide.tours} tours today</span>
              </div>
              <div className="mt-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {guide.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { icon: QrCode, label: 'Scan QR', color: 'from-blue-500 to-blue-600' },
    { icon: UserCheck, label: 'Guides', color: 'from-florida-ocean to-florida-sunset' },
    { icon: Wallet, label: 'Earnings', color: 'from-purple-500 to-purple-600' },
    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerHaptic('medium')}
            className={`bg-gradient-to-br ${action.color} rounded-3xl p-6 text-white shadow-lg flex flex-col items-center justify-center gap-3 h-32`}
          >
            <action.icon className="w-8 h-8" />
            <span className="font-bold">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    {
      icon: '📅',
      title: 'New booking',
      subtitle: 'Dunn\'s River Falls - 4 guests',
      time: '5m ago'
    },
    {
      icon: '⭐',
      title: 'New review',
      subtitle: '5 stars from Sarah Johnson',
      time: '1h ago'
    },
    {
      icon: '💰',
      title: 'Payment received',
      subtitle: '$150 from yesterday\'s tours',
      time: '2h ago'
    },
    {
      icon: '📸',
      title: 'Media uploaded',
      subtitle: 'Blue Mountain Coffee Tour',
      time: '3h ago'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="min-w-[280px] snap-center"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex gap-3">
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'tours', icon: Calendar, label: 'Tours' },
    { id: 'guides', icon: UserCheck, label: 'Guides' },
    { id: 'earnings', icon: Wallet, label: 'Earnings' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              triggerHaptic('light');
            }}
            className="flex flex-col items-center gap-1 py-2"
          >
            <tab.icon
              className={`w-6 h-6 transition-all ${
                activeTab === tab.id
                  ? 'text-florida-ocean'
                  : 'text-gray-400'
              }`}
              fill={activeTab === tab.id ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function WeatherAlertBanner({
  alert,
  onDismiss
}: {
  alert: {
    severity: string;
    condition: string;
    timeRange: string;
    affectedTours: number;
    message: string;
  };
  onDismiss: () => void;
}) {
  const [showAffectedTours, setShowAffectedTours] = useState(false);

  const affectedTours = [
    { name: 'Everglades Airboat Adventure', time: '2:00 PM', guests: 6 },
    { name: 'Key West Sunset Cruise', time: '3:00 PM', guests: 8 },
    { name: 'Beach Kayaking Tour', time: '3:30 PM', guests: 4 }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-5 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
            <CloudRain className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <h3 className="text-white font-bold text-lg">Weather Alert</h3>
                </div>
                <p className="text-white/90 text-sm font-medium">
                  {alert.condition} expected {alert.timeRange}
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/80 text-sm mb-3">{alert.message}</p>

            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAffectedTours(!showAffectedTours)}
                className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {alert.affectedTours} Affected Tours
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm border border-white/30"
              >
                Batch Cancel
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAffectedTours && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/20 overflow-hidden"
            >
              <div className="space-y-2">
                {affectedTours.map((tour, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">{tour.name}</span>
                      <span className="text-white/80 text-xs">{tour.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Clock className="w-3 h-3" />
                      {tour.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function PendingState() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center p-8">
      <div className="text-center text-white">
        <motion.div
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-8"
        >
          <Clock className="w-full h-full" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">Reviewing Your Application</h1>

        <div className="w-48 h-48 mx-auto my-8 relative">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="white"
              strokeOpacity="0.2"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 138 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">75%</span>
          </div>
        </div>

        <p className="text-xl opacity-90 mb-8">Expected approval: Within 24 hours</p>

        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">Application Timeline</h3>
          <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory scrollbar-hide pb-2">
            {['Submitted', 'Under Review', 'Verification', 'Approved'].map((step, index) => (
              <div key={index} className="min-w-[140px] snap-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  index <= 1 ? 'bg-white text-purple-600' : 'bg-white/20'
                }`}>
                  {index <= 1 ? '✓' : index + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
