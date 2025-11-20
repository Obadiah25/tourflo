// Helper function for HeroCard gradient colors based on category
export function getCategoryGradient(categoryId: string): string {
    const gradients: Record<string, string> = {
        'fishing': 'from-blue-600/85 to-purple-600/85',
        'boat-tours': 'from-blue-500/85 to-blue-700/85',
        'eco-tours': 'from-green-600/85 to-teal-600/85',
        'airboat': 'from-green-500/85 to-emerald-700/85',
        'historical': 'from-amber-600/85 to-orange-600/85',
        'water-sports': 'from-cyan-500/85 to-blue-600/85',
        'sunset': 'from-orange-500/85 to-pink-600/85',
        'nature': 'from-green-600/85 to-lime-700/85',
        'adventure': 'from-purple-600/85 to-pink-600/85',
        'cultural': 'from-amber-600/85 to-orange-700/85',
    };
    return gradients[categoryId] || 'from-purple-600/85 to-blue-600/85';
}
