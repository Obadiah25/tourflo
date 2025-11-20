export interface TourGuideResponse {
  message: string;
  suggestions?: string[];
}

// Flobot - Your Florida Tour Guide
export const getTourGuideResponse = async (message: string): Promise<TourGuideResponse> => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      message: '👋 Hey there! I\'m Flobot, your Florida tour guide! Ready to discover the Sunshine State? What adventure are you looking for?',
      suggestions: ['Fishing charters', 'Everglades tours', 'Sunset cruises', 'Water sports'],
    };
  }

  if (lowerMessage.includes('fish')) {
    return {
      message: '🎣 Florida fishing is world-class! Deep sea charters in Miami, fly fishing in the Keys, or inshore action in Tampa Bay. What\'s your style?',
      suggestions: ['Deep sea fishing', 'Fly fishing Keys', 'Inshore charters'],
    };
  }

  if (lowerMessage.includes('everglades') || lowerMessage.includes('airboat')) {
    return {
      message: '🐊 The Everglades are incredible! High-speed airboat rides through the River of Grass, spot gators, and learn about this unique ecosystem. Ready for adventure?',
      suggestions: ['Airboat tours', 'Eco tours', 'Wildlife spotting'],
    };
  }

  if (lowerMessage.includes('sunset') || lowerMessage.includes('cruise')) {
    return {
      message: '🌅 Florida sunsets are magical! Key West has the famous sunset celebration, or try a romantic dinner cruise in Miami. What vibe are you after?',
      suggestions: ['Key West sunset', 'Dinner cruises', 'Party boats'],
    };
  }

  if (lowerMessage.includes('miami') || lowerMessage.includes('beach')) {
    return {
      message: '🏖️ Miami Beach is iconic! South Beach for the scene, Clearwater for families, or the Keys for that laid-back island feel. What are you looking for?',
      suggestions: ['South Beach action', 'Family beaches', 'Island vibes'],
    };
  }

  if (lowerMessage.includes('water sport') || lowerMessage.includes('jet ski') || lowerMessage.includes('parasail')) {
    return {
      message: '🚤 Florida is the ultimate water sports playground! Jet skiing, parasailing, wakeboarding - the options are endless. What gets your heart racing?',
      suggestions: ['Jet ski tours', 'Parasailing', 'Wakeboarding'],
    };
  }

  if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('cuban')) {
    return {
      message: '🍽️ Florida cuisine is amazing! Fresh stone crab, authentic Cuban in Little Havana, or key lime pie in the Keys. Hungry yet?',
      suggestions: ['Cuban food tours', 'Seafood spots', 'Key lime pie'],
    };
  }

  if (lowerMessage.includes('orlando') || lowerMessage.includes('theme park')) {
    return {
      message: '🎢 Beyond the big theme parks, Orlando has amazing nature! Zip-lining, kayaking, and unique Florida experiences. Want something different?',
      suggestions: ['Zip-lining', 'Kayak tours', 'Nature walks'],
    };
  }

  // Default response
  return {
    message: '🌴 Florida has so much to offer! From fishing charters to Everglades adventures, sunset cruises to water sports. What interests you?',
    suggestions: ['Fishing', 'Eco-tours', 'Cruises', 'Water sports', 'Cultural tours'],
  };
};

export const getJahboiResponse = getTourGuideResponse;
export type JahboiResponse = TourGuideResponse;
