import { useEffect, useState } from 'react';
import { Heart, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { haptics } from '../lib/haptics';

interface SavedExperience {
  experience_id: string;
  experiences: {
    id: string;
    title: string;
    image_url: string;
    price_jmd: number;
    price_usd: number;
    location_name: string;
  };
}

interface SavedScreenProps {
  session: any;
}

export default function SavedScreen({ session }: SavedScreenProps) {
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currency_pref } = useAppStore();

  useEffect(() => {
    if (session) {
      loadSavedExperiences();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const loadSavedExperiences = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('saved_experiences')
      .select('experience_id, experiences(id, title, image_url, price_jmd, price_usd, location_name)')
      .eq('user_id', session.user.id);

    if (data) {
      setSavedExperiences(data as any);
    }
    setIsLoading(false);
  };

  const handleUnsave = async (experienceId: string) => {
    haptics.light();
    await supabase
      .from('saved_experiences')
      .delete()
      .eq('user_id', session.user.id)
      .eq('experience_id', experienceId);

    setSavedExperiences((prev) =>
      prev.filter((item) => item.experience_id !== experienceId)
    );
  };

  const handleShare = async () => {
    haptics.medium();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Jamaica Wishlist',
          text: 'Check out my LOOKYAH wishlist!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  if (!session) {
    return (
      <div className="fixed inset-0 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-center">
            <div className="text-7xl mb-6">❤️</div>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: 'Poppins' }}>
              Sign in to save experiences
            </h2>
            <p className="text-lg text-white/90 drop-shadow-md">Keep track of places you want to visit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-3xl font-bold text-white drop-shadow-lg"
              style={{ fontFamily: 'Poppins', fontWeight: 700 }}
            >
              Saved
            </h1>
            {savedExperiences.length > 0 && (
              <button
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg hover:bg-white/30 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
            )}
          </div>

          {savedExperiences.length > 0 && (
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-white" />
              <p className="text-white text-sm drop-shadow-md">
                {savedExperiences.length} {savedExperiences.length === 1 ? 'experience' : 'experiences'} saved
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">❤️</div>
                <p className="text-lg text-white/90 drop-shadow-md">Loading saved experiences...</p>
              </div>
            </div>
          ) : savedExperiences.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-6">❤️</div>
                <h2
                  className="text-2xl font-bold text-white mb-4 drop-shadow-lg"
                  style={{ fontFamily: 'Poppins' }}
                >
                  No saved experiences yet
                </h2>
                <p className="text-lg text-white/90 drop-shadow-md mb-2">
                  Tap the heart button on experiences
                </p>
                <p className="text-base text-white/80 drop-shadow-md">
                  to create your Jamaica wishlist!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-4">
              {savedExperiences.map((item, index) => {
                const experience = item.experiences;
                const price = currency_pref === 'JMD'
                  ? `J$${(experience.price_jmd / 100).toFixed(0)}`
                  : `$${(experience.price_usd / 100).toFixed(0)}`;

                return (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl group"
                  >
                    <div
                      className="aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${experience.image_url})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                      <p className="text-white font-bold text-base mb-1 drop-shadow-lg line-clamp-2" style={{ fontFamily: 'Poppins' }}>
                        {experience.title}
                      </p>
                      <p className="text-white/90 text-sm drop-shadow-md mb-1">
                        {experience.location_name}
                      </p>
                      <p className="text-white font-semibold text-lg drop-shadow-md" style={{ fontFamily: 'Poppins' }}>
                        {price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnsave(experience.id)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                    <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                      Available
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
