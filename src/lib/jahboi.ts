export interface TourGuideResponse {
  message: string;
  suggestions?: string[];
}

export const getTourGuideResponse = async (message: string): Promise<TourGuideResponse> => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      message: 'Hello! Welcome to TourFlo Florida! How can I help you today?',
      suggestions: ['Show me beaches', 'Adventure activities', 'Best attractions'],
    };
  }

  if (lowerMessage.includes('beach')) {
    return {
      message: 'Florida has some of the most beautiful beaches in the world! From Miami Beach to Clearwater, there\'s something for everyone. What type of beach experience are you looking for?',
      suggestions: ['Party beaches', 'Quiet spots', 'Water sports'],
    };
  }

  if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
    return {
      message: 'Florida offers amazing cuisine! Fresh seafood, Cuban food, key lime pie - all delicious! Where are you staying?',
      suggestions: ['Seafood spots', 'Cuban food', 'Local restaurants'],
    };
  }

  return {
    message: 'I hear you! Let me help you find the perfect Florida experience. What interests you most?',
    suggestions: ['Activities', 'Food & Drink', 'Nightlife', 'Culture'],
  };
};

export const getJahboiResponse = getTourGuideResponse;
export type JahboiResponse = TourGuideResponse;
