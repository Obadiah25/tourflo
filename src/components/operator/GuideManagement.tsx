import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit, Trash2, Phone, Award, Calendar, Check } from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';
import { supabase } from '../../lib/supabase';

interface Guide {
  id: string;
  name: string;
  phone: string;
  photo_url: string;
  certifications: string[];
  availability_schedule: Record<string, string[]>;
  is_available: boolean;
  created_at?: string;
}

export default function GuideManagement() {
  const [guides, setGuides] = useState<Guide[]>([
    {
      id: '1',
      name: 'Mike Rodriguez',
      phone: '+1 305-555-0123',
      photo_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      certifications: ['CPR Certified', 'First Aid', 'Tour Guide License'],
      availability_schedule: {
        'Monday': ['9:00 AM', '2:00 PM'],
        'Wednesday': ['10:00 AM', '3:00 PM'],
        'Friday': ['9:00 AM', '1:00 PM']
      },
      is_available: true
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      phone: '+1 305-555-0456',
      photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      certifications: ['CPR Certified', 'Bilingual (EN/ES)', 'Lifeguard'],
      availability_schedule: {
        'Tuesday': ['11:00 AM', '4:00 PM'],
        'Thursday': ['9:00 AM', '2:00 PM'],
        'Saturday': ['10:00 AM', '3:00 PM']
      },
      is_available: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  const handleDeleteGuide = (id: string) => {
    setGuides(guides.filter(g => g.id !== id));
    triggerHaptic('medium');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 pb-32">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Guides</h1>
            <p className="text-gray-500">{guides.length} active guides</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAddModal(true);
              triggerHaptic('light');
            }}
            className="w-14 h-14 bg-gradient-to-br from-florida-ocean to-florida-sunset text-white rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Plus className="w-7 h-7" />
          </motion.button>
        </div>

        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2">
          {guides.map((guide) => (
            <motion.div
              key={guide.id}
              whileTap={{ scale: 0.95 }}
              className="min-w-[320px] snap-center"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="relative h-64">
                  <img
                    src={guide.photo_url}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGuide(guide);
                        setShowAddModal(true);
                        triggerHaptic('light');
                      }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGuide(guide.id)}
                      className="w-10 h-10 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      guide.is_available
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      {guide.is_available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-2xl mb-2">{guide.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Phone className="w-4 h-4" />
                      {guide.phone}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guide.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Availability</span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(guide.availability_schedule).map(([day, times]) => (
                        <div key={day} className="text-xs text-gray-600">
                          <span className="font-medium">{day}:</span> {times.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {guides.length === 0 && (
            <div className="min-w-full flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-6xl mb-4">🧑‍🏫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No guides yet</h2>
                <p className="text-gray-500 mb-6">Add your first tour guide to get started</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-br from-florida-ocean to-florida-sunset text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Add Your First Guide
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddGuideModal
            guide={editingGuide}
            onClose={() => {
              setShowAddModal(false);
              setEditingGuide(null);
            }}
            onSave={(guide) => {
              if (editingGuide) {
                setGuides(guides.map(g => g.id === guide.id ? guide : g));
              } else {
                setGuides([...guides, { ...guide, id: Date.now().toString() }]);
              }
              setShowAddModal(false);
              setEditingGuide(null);
              triggerHaptic('success');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddGuideModal({
  guide,
  onClose,
  onSave
}: {
  guide: Guide | null;
  onClose: () => void;
  onSave: (guide: Guide) => void;
}) {
  const [formData, setFormData] = useState<Partial<Guide>>(
    guide || {
      name: '',
      phone: '',
      photo_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      certifications: [],
      availability_schedule: {},
      is_available: true
    }
  );

  const [newCert, setNewCert] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const handleAddCertification = () => {
    if (newCert.trim()) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), newCert.trim()]
      });
      setNewCert('');
      triggerHaptic('light');
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setFormData({
      ...formData,
      certifications: (formData.certifications || []).filter(c => c !== cert)
    });
    triggerHaptic('light');
  };

  const handleAddAvailability = () => {
    if (selectedDay && selectedTime) {
      const schedule = formData.availability_schedule || {};
      const dayTimes = schedule[selectedDay] || [];

      if (!dayTimes.includes(selectedTime)) {
        setFormData({
          ...formData,
          availability_schedule: {
            ...schedule,
            [selectedDay]: [...dayTimes, selectedTime].sort()
          }
        });
        triggerHaptic('light');
      }

      setSelectedDay('');
      setSelectedTime('');
    }
  };

  const handleRemoveAvailability = (day: string, time: string) => {
    const schedule = { ...(formData.availability_schedule || {}) };
    schedule[day] = schedule[day].filter(t => t !== time);
    if (schedule[day].length === 0) {
      delete schedule[day];
    }
    setFormData({ ...formData, availability_schedule: schedule });
    triggerHaptic('light');
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in name and phone');
      return;
    }
    onSave(formData as Guide);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {guide ? 'Edit Guide' : 'Add New Guide'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
              placeholder="Guide name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
              placeholder="+1 305-555-0123"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Photo URL</label>
            <input
              type="url"
              value={formData.photo_url || ''}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Certifications</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
                placeholder="Add certification..."
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddCertification}
                className="w-12 h-12 bg-florida-ocean text-white rounded-2xl flex items-center justify-center"
              >
                <Plus className="w-6 h-6" />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.certifications || []).map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {cert}
                  <button
                    onClick={() => handleRemoveCertification(cert)}
                    className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Availability Schedule</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
              >
                <option value="">Select Day</option>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-florida-ocean"
              >
                <option value="">Select Time</option>
                {TIMES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddAvailability}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium mb-3"
            >
              Add Time Slot
            </motion.button>
            <div className="space-y-2">
              {Object.entries(formData.availability_schedule || {}).map(([day, times]) => (
                <div key={day} className="bg-gray-50 rounded-2xl p-4">
                  <div className="font-medium text-gray-900 mb-2">{day}</div>
                  <div className="flex flex-wrap gap-2">
                    {times.map((time) => (
                      <div
                        key={time}
                        className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                      >
                        {time}
                        <button
                          onClick={() => handleRemoveAvailability(day, time)}
                          className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_available || false}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-6 h-6 rounded border-gray-300 text-florida-ocean focus:ring-florida-ocean"
              />
              <span className="text-sm font-medium text-gray-700">Currently Available</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-br from-florida-ocean to-florida-sunset text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6" />
            {guide ? 'Save Changes' : 'Add Guide'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
