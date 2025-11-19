import { MapPin } from 'lucide-react';

interface ExperienceCardProps {
  experience: {
    id: string;
    title: string;
    image_url: string;
    price_usd: number;
    price_jmd: number;
    location_name: string;
  };
  currency: 'USD' | 'JMD';
  onBook: () => void;
}

export default function ExperienceCard({ experience, currency, onBook }: ExperienceCardProps) {
  const price = currency === 'JMD'
    ? `J$${(experience.price_jmd / 100).toFixed(2)}`
    : `$${(experience.price_usd / 100).toFixed(2)} USD`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 my-2">
      <div
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${experience.image_url})` }}
      />
      <div className="p-3">
        <h4 className="font-bold text-gray-900 mb-1">{experience.title}</h4>
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="w-3 h-3" />
          <span>{experience.location_name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{price}</span>
          <button
            onClick={onBook}
            className="bg-gradient-skysand-r text-gray-900 font-medium px-4 py-1.5 rounded-lg text-sm hover:shadow-md transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
