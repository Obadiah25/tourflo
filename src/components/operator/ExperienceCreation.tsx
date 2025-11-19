import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Upload, Camera, Check, MapPin, Clock,
  DollarSign, Users, Calendar, Plus, X, Sparkles
} from 'lucide-react';
import { triggerHaptic, cardVariants } from '../../lib/gestures';

export default function ExperienceCreation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    vibeTags: [] as string[],
    description: '',
    tagline: '',
    price: '',
    groupSize: { min: 1, max: 10 },
    duration: { hours: 2, minutes: 0 },
    ageRestriction: 'all',
    difficulty: 'easy',
    languages: [] as string[],
    included: [] as string[],
    notIncluded: [] as string[],
    whatToBring: [] as string[],
    coverPhoto: null,
    gallery: [] as string[],
    video: null,
    location: { lat: 0, lng: 0 },
    address: '',
    meetingInstructions: '',
    parking: false,
    parkingDetails: '',
    availability: {}
  });

  const steps = [
    { id: 'basics', title: 'Basics', component: <BasicsStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'description', title: 'Description', component: <DescriptionStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'pricing', title: 'Pricing', component: <PricingStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'included', title: 'What\'s Included', component: <IncludedStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'media', title: 'Media', component: <MediaStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'location', title: 'Location', component: <LocationStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'availability', title: 'Availability', component: <AvailabilityStep formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'preview', title: 'Preview', component: <PreviewStep formData={formData} onPublish={handlePublish} /> }
  ];

  function nextStep() {
    triggerHaptic('light');
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    triggerHaptic('light');
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  }

  function handlePublish() {
    triggerHaptic('success');
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 overflow-hidden">
      <div className="absolute top-6 left-0 right-0 px-6 z-10">
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{
                  width: index < currentStep ? '100%' : index === currentStep ? '50%' : '0%'
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevStep}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 pt-20"
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BasicsStep({ formData, setFormData, onNext }: any) {
  const categories = ['Tour', 'Adventure', 'Food & Drink', 'Culture', 'Nature', 'Water Sports', 'Nightlife', 'Shopping'];
  const vibes = ['Family Friendly', 'Romantic', 'Adventure', 'Relaxing', 'Educational', 'Party', 'Luxury', 'Budget'];

  const toggleVibe = (vibe: string) => {
    const current = formData.vibeTags || [];
    if (current.includes(vibe)) {
      setFormData({ ...formData, vibeTags: current.filter((v: string) => v !== vibe) });
    } else if (current.length < 3) {
      setFormData({ ...formData, vibeTags: [...current, vibe] });
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Experience Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white placeholder-white/50 text-2xl font-bold focus:ring-2 focus:ring-white/50"
            placeholder="What's your experience?"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Category</label>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x snap-mandatory">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFormData({ ...formData, category })}
                className={`px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap snap-center transition-all ${
                  formData.category === category
                    ? 'bg-white text-purple-600 scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Vibe (Select up to 3)</label>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => {
              const isSelected = formData.vibeTags?.includes(vibe);
              return (
                <button
                  key={vibe}
                  onClick={() => toggleVibe(vibe)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-yellow-400 text-gray-900 scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          disabled={!formData.title || !formData.category}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function DescriptionStep({ formData, setFormData, onNext }: any) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Tagline</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-3 text-white placeholder-white/50"
            placeholder="A short, catchy tagline..."
            maxLength={60}
          />
          <div className="text-right text-white/60 text-xs mt-2">
            {formData.tagline?.length || 0}/60
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Full Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white placeholder-white/50 min-h-[300px] focus:ring-2 focus:ring-white/50"
            placeholder="Tell tourists all about your experience..."
          />
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PricingStep({ formData, setFormData, onNext }: any) {
  const difficulties = ['Easy', 'Moderate', 'Challenging', 'Expert'];
  const ages = ['All Ages', '18+', '21+'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Patois'];

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Price per Person</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-white/50" />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-white/20 border-0 rounded-2xl pl-16 pr-4 py-6 text-white placeholder-white/50 text-5xl font-bold focus:ring-2 focus:ring-white/50"
              placeholder="50"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-4">Group Size</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/70 text-xs mb-2">Minimum</div>
              <input
                type="number"
                value={formData.groupSize.min}
                onChange={(e) => setFormData({
                  ...formData,
                  groupSize: { ...formData.groupSize, min: parseInt(e.target.value) }
                })}
                className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white text-2xl font-bold text-center"
              />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-2">Maximum</div>
              <input
                type="number"
                value={formData.groupSize.max}
                onChange={(e) => setFormData({
                  ...formData,
                  groupSize: { ...formData.groupSize, max: parseInt(e.target.value) }
                })}
                className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white text-2xl font-bold text-center"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-4">Duration</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/70 text-xs mb-2">Hours</div>
              <input
                type="number"
                value={formData.duration.hours}
                onChange={(e) => setFormData({
                  ...formData,
                  duration: { ...formData.duration, hours: parseInt(e.target.value) }
                })}
                className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white text-2xl font-bold text-center"
              />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-2">Minutes</div>
              <input
                type="number"
                value={formData.duration.minutes}
                onChange={(e) => setFormData({
                  ...formData,
                  duration: { ...formData.duration, minutes: parseInt(e.target.value) }
                })}
                className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white text-2xl font-bold text-center"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Difficulty</label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setFormData({ ...formData, difficulty: diff.toLowerCase() })}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                  formData.difficulty === diff.toLowerCase()
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Age Restriction</label>
          <div className="flex gap-2">
            {ages.map((age) => (
              <button
                key={age}
                onClick={() => setFormData({ ...formData, ageRestriction: age })}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                  formData.ageRestriction === age
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Languages</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  const current = formData.languages || [];
                  setFormData({
                    ...formData,
                    languages: current.includes(lang)
                      ? current.filter((l: string) => l !== lang)
                      : [...current, lang]
                  });
                }}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  formData.languages?.includes(lang)
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function IncludedStep({ formData, setFormData, onNext }: any) {
  const [newIncluded, setNewIncluded] = useState('');
  const [newNotIncluded, setNewNotIncluded] = useState('');
  const [newBring, setNewBring] = useState('');

  const addItem = (field: string, value: string, setter: Function) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...(formData[field] || []), value.trim()] });
      setter('');
      triggerHaptic('light');
    }
  };

  const removeItem = (field: string, index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_: any, i: number) => i !== index)
    });
    triggerHaptic('light');
  };

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">What's Included</label>
          <div className="space-y-2 mb-4">
            {formData.included?.map((item: string, index: number) => (
              <div key={index} className="bg-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-white">{item}</span>
                <button onClick={() => removeItem('included', index)}>
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIncluded}
              onChange={(e) => setNewIncluded(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('included', newIncluded, setNewIncluded)}
              className="flex-1 bg-white/20 border-0 rounded-2xl px-4 py-3 text-white placeholder-white/50"
              placeholder="Add item..."
            />
            <button
              onClick={() => addItem('included', newIncluded, setNewIncluded)}
              className="bg-white text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Not Included</label>
          <div className="space-y-2 mb-4">
            {formData.notIncluded?.map((item: string, index: number) => (
              <div key={index} className="bg-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-white">{item}</span>
                <button onClick={() => removeItem('notIncluded', index)}>
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNotIncluded}
              onChange={(e) => setNewNotIncluded(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('notIncluded', newNotIncluded, setNewNotIncluded)}
              className="flex-1 bg-white/20 border-0 rounded-2xl px-4 py-3 text-white placeholder-white/50"
              placeholder="Add item..."
            />
            <button
              onClick={() => addItem('notIncluded', newNotIncluded, setNewNotIncluded)}
              className="bg-white text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">What to Bring</label>
          <div className="space-y-2 mb-4">
            {formData.whatToBring?.map((item: string, index: number) => (
              <div key={index} className="bg-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-white">{item}</span>
                <button onClick={() => removeItem('whatToBring', index)}>
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBring}
              onChange={(e) => setNewBring(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('whatToBring', newBring, setNewBring)}
              className="flex-1 bg-white/20 border-0 rounded-2xl px-4 py-3 text-white placeholder-white/50"
              placeholder="Add item..."
            />
            <button
              onClick={() => addItem('whatToBring', newBring, setNewBring)}
              className="bg-white text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function MediaStep({ formData, setFormData, onNext }: any) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <label className="block text-white text-sm mb-4">Cover Photo</label>
          <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 text-center cursor-pointer hover:border-white/50 transition-all">
            <Camera className="w-16 h-16 text-white/70 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">Tap to upload</p>
            <p className="text-white/70 text-sm">or drag file here</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <label className="block text-white text-sm mb-4">Photo Gallery</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center cursor-pointer hover:border-white/50 transition-all"
              >
                <Plus className="w-8 h-8 text-white/70" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <label className="block text-white text-sm mb-4">Video (Optional)</label>
          <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 text-center cursor-pointer hover:border-white/50 transition-all">
            <Upload className="w-16 h-16 text-white/70 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">Upload Video</p>
            <p className="text-white/70 text-sm">Available on Growth & Pro plans</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function LocationStep({ formData, setFormData, onNext }: any) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 h-64">
          <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white/50" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white placeholder-white/50"
            placeholder="Enter location..."
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Meeting Instructions</label>
          <textarea
            value={formData.meetingInstructions}
            onChange={(e) => setFormData({ ...formData, meetingInstructions: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white placeholder-white/50 min-h-[120px]"
            placeholder="How should guests find you?"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.parking}
              onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
              className="w-6 h-6 rounded"
            />
            <span className="text-white font-medium">Parking Available</span>
          </label>
          {formData.parking && (
            <input
              type="text"
              value={formData.parkingDetails}
              onChange={(e) => setFormData({ ...formData, parkingDetails: e.target.value })}
              className="w-full bg-white/20 border-0 rounded-2xl px-4 py-3 text-white placeholder-white/50 mt-3"
              placeholder="Parking details..."
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function AvailabilityStep({ formData, setFormData, onNext }: any) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-4">Available Days</label>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-white text-sm font-medium hover:bg-white/30 transition-all"
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-4">Time Slots</label>
          <div className="space-y-3">
            <div className="bg-white/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/70" />
                <span className="text-white">9:00 AM</span>
              </div>
              <button className="text-white/70">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/20 text-white py-3 rounded-2xl font-medium hover:bg-white/30 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Time Slot
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">Cancellation Policy</label>
          <div className="space-y-2">
            {['Flexible', 'Moderate', 'Strict'].map((policy) => (
              <button
                key={policy}
                className="w-full bg-white/20 text-white py-4 rounded-2xl font-medium hover:bg-white/30 transition-all"
              >
                {policy}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Preview
        </button>
      </div>
    </div>
  );
}

function PreviewStep({ formData, onPublish }: any) {
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    setPublished(true);
    onPublish();
  };

  if (published) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">Published!</h1>
          <p className="text-white/80 text-xl mb-8">Your experience is now live</p>
          <div className="flex gap-3 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold">
              View Live
            </button>
            <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold border border-white/30">
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center text-white mb-6">
          <h2 className="text-3xl font-bold mb-2">Preview</h2>
          <p className="opacity-80">How tourists will see your experience</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Camera className="w-24 h-24 text-white/50" />
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formData.title || 'Experience Title'}</h3>
              <p className="text-gray-500">{formData.tagline || 'Tagline goes here'}</p>
            </div>

            <div className="flex gap-2">
              {formData.vibeTags?.map((tag: string) => (
                <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formData.duration.hours}h {formData.duration.minutes}m
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formData.groupSize.min}-{formData.groupSize.max}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${formData.price}
              </div>
            </div>

            <p className="text-gray-700 text-sm line-clamp-3">
              {formData.description || 'Description will appear here...'}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={handlePublish}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-2"
        >
          <Sparkles className="w-6 h-6" />
          Publish Experience
        </button>
      </div>
    </div>
  );
}
