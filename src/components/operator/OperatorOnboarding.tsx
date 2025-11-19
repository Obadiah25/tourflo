import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Camera, Check, Sparkles } from 'lucide-react';
import { triggerHaptic, cardVariants } from '../../lib/gestures';

interface OnboardingStep {
  id: string;
  title: string;
  component: React.ReactNode;
}

export default function OperatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    parish: '',
    description: '',
    yearsInOperation: 1,
    tier: 'starter'
  });

  const steps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', component: <WelcomeCard onNext={nextStep} /> },
    { id: 'basic', title: 'Basic Info', component: <BasicInfoCard formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'details', title: 'Details', component: <BusinessDetailsCard formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'verification', title: 'Verification', component: <VerificationCard onNext={nextStep} /> },
    { id: 'tier', title: 'Choose Tier', component: <TierCard formData={formData} setFormData={setFormData} onNext={nextStep} /> },
    { id: 'payment', title: 'Payment', component: <PaymentCard onNext={nextStep} /> },
    { id: 'review', title: 'Review', component: <ReviewCard formData={formData} onComplete={handleComplete} /> }
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

  function handleComplete() {
    triggerHaptic('success');
  }

  return (
    <div className="fixed inset-0 gradient-skysand overflow-hidden">
      <div className="absolute top-6 left-0 right-0 px-6 z-10">
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 bg-gray-900/20 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-[#390067]"
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

      {currentStep > 0 && (
        <button
          onClick={prevStep}
          className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

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

function WelcomeCard({ onNext }: { onNext: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-gray-900" onClick={onNext}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <Sparkles className="w-24 h-24 mb-8 text-[#390067]" />
      </motion.div>
      <h1 className="text-5xl font-bold mb-4 text-center text-gray-900">Welcome to LOOKYAH</h1>
      <p className="text-xl text-center text-gray-700 mb-12">
        Let's set up your business in 6 steps
      </p>
      <p className="text-sm text-gray-600">Tap anywhere to continue</p>
    </div>
  );
}

function BasicInfoCard({ formData, setFormData, onNext }: any) {
  const businessTypes = ['Tour', 'Activity', 'Attraction', 'Food & Drink', 'Accommodation', 'Transport'];
  const parishes = ['Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny', 'St. Ann', 'St. Mary', 'Portland', 'St. Thomas'];

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-2 font-semibold">Business Name</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 text-lg focus:ring-2 focus:ring-[#390067] focus:border-[#390067]"
            placeholder="Your awesome business"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-3 font-semibold">Business Type</label>
          <div className="flex flex-wrap gap-2">
            {businessTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, businessType: type })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  formData.businessType === type
                    ? 'bg-[#390067] text-white scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg space-y-4">
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#390067]"
            placeholder="Contact Name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#390067]"
            placeholder="Email"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#390067]"
            placeholder="Phone"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-3 font-semibold">Parish</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {parishes.map((parish) => (
              <button
                key={parish}
                onClick={() => setFormData({ ...formData, parish })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap snap-center transition-all ${
                  formData.parish === parish
                    ? 'bg-[#390067] text-white scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {parish}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!formData.businessName || !formData.businessType || !formData.parish}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

function BusinessDetailsCard({ formData, setFormData, onNext }: any) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-2 font-semibold">Business Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 min-h-[200px] focus:ring-2 focus:ring-[#390067]"
            placeholder="Tell us about your business..."
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-3 font-semibold">Years in Operation</label>
          <input
            type="range"
            min="1"
            max="50"
            value={formData.yearsInOperation}
            onChange={(e) => setFormData({ ...formData, yearsInOperation: parseInt(e.target.value) })}
            className="w-full accent-[#390067]"
          />
          <div className="text-center text-gray-900 text-4xl font-bold mt-4">
            {formData.yearsInOperation} {formData.yearsInOperation === 1 ? 'Year' : 'Years'}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

function VerificationCard({ onNext }: { onNext: () => void }) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({});

  const documents = [
    { id: 'registration', label: 'Business Registration', icon: Upload },
    { id: 'license', label: 'License', icon: Upload },
    { id: 'insurance', label: 'Insurance', icon: Upload },
    { id: 'id', label: 'Photo ID', icon: Camera },
    { id: 'logo', label: 'Logo', icon: Upload },
    { id: 'cover', label: 'Cover Photo', icon: Camera }
  ];

  const handleUpload = (id: string) => {
    triggerHaptic('medium');
    setUploads({ ...uploads, [id]: true });
  };

  const uploadedCount = Object.keys(uploads).length;

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex snap-x snap-mandatory h-full">
        {documents.map((doc, index) => (
          <div key={doc.id} className="min-w-full snap-center flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <div className="text-gray-900 text-center mb-8">
                <div className="text-sm text-gray-600 mb-2">{index + 1} of {documents.length}</div>
                <h2 className="text-3xl font-bold">{doc.label}</h2>
              </div>

              <div
                onClick={() => handleUpload(doc.id)}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-12 border-2 border-dashed cursor-pointer transition-all shadow-lg ${
                  uploads[doc.id]
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {uploads[doc.id] ? (
                  <div className="text-center">
                    <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-900 text-lg font-semibold">Uploaded!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <doc.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 text-lg mb-2 font-semibold">Tap to upload</p>
                    <p className="text-gray-600 text-sm">or drag file here</p>
                  </div>
                )}
              </div>

              {index < documents.length - 1 && (
                <p className="text-gray-600 text-center mt-6">← Swipe for next →</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed top-24 left-6 right-6 z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 text-gray-900 text-center font-semibold shadow-lg">
          {uploadedCount} of {documents.length} uploaded
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}

function TierCard({ formData, setFormData, onNext }: any) {
  const tiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'FREE',
      features: ['1 Experience', 'Basic Photos', 'Email Support']
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$49/mo',
      features: ['5 Experiences', 'Photo Gallery', 'Priority Support', 'Analytics']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$99/mo',
      features: ['Unlimited', 'Video Content', 'Pro Shoots', '24/7 Support', 'Featured Listing']
    }
  ];

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex snap-x snap-mandatory h-full">
        {tiers.map((tier) => (
          <div key={tier.id} className="min-w-full snap-center flex items-center justify-center p-8">
            <div
              onClick={() => setFormData({ ...formData, tier: tier.id })}
              className={`w-full max-w-lg bg-white rounded-3xl p-12 shadow-2xl cursor-pointer transition-all ${
                formData.tier === tier.id ? 'ring-8 ring-[#FFD700] scale-105' : ''
              }`}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{tier.name}</h2>
                <div className="text-6xl font-bold text-[#390067] my-6">{tier.price}</div>
              </div>

              <div className="space-y-4">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              {formData.tier === tier.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-8 bg-[#FFD700] text-gray-900 py-3 px-6 rounded-full text-center font-bold"
                >
                  Selected
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}

function PaymentCard({ onNext }: { onNext: () => void }) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-gray-900 text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Payment Setup</h2>
          <p className="text-gray-700">Configure how you'll get paid</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-3 font-semibold">Payment Method</label>
          <div className="space-y-3">
            {['Lynk', 'WiPay', 'Bank Transfer'].map((method) => (
              <button
                key={method}
                className="w-full bg-white border border-gray-300 hover:border-[#390067] text-gray-900 py-4 px-6 rounded-2xl text-left transition-all font-medium"
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-lg">
          <label className="block text-gray-700 text-sm mb-2 font-semibold">TRN (Optional)</label>
          <input
            type="text"
            className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#390067]"
            placeholder="Tax Registration Number"
          />
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Complete Setup
        </motion.button>
      </div>
    </div>
  );
}

function ReviewCard({ formData, onComplete }: any) {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    triggerHaptic('success');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (submitted) {
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
            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">You're In!</h1>
          <p className="text-gray-700 text-xl">Setting up your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-gray-900 text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Review & Submit</h2>
          <p className="text-gray-700">Check everything looks good</p>
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-4 shadow-lg">
          <div>
            <div className="text-sm text-gray-500">Business Name</div>
            <div className="text-xl font-bold text-gray-900">{formData.businessName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Type</div>
            <div className="text-lg text-gray-900">{formData.businessType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Location</div>
            <div className="text-lg text-gray-900">{formData.parish}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Plan</div>
            <div className="text-lg text-gray-900 capitalize">{formData.tier}</div>
          </div>
        </div>

        <button
          onClick={() => setAgreed(!agreed)}
          className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 text-left flex items-start gap-4 shadow-lg"
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
            agreed ? 'bg-green-500' : 'bg-gray-200'
          }`}>
            {agreed && <Check className="w-4 h-4 text-white" />}
          </div>
          <div className="text-gray-700 text-sm">
            I agree to the Terms of Service and Privacy Policy. I understand that LOOKYAH will review my application.
          </div>
        </button>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <motion.button
          onClick={handleSubmit}
          disabled={!agreed}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          Submit Application
        </motion.button>
      </div>
    </div>
  );
}
