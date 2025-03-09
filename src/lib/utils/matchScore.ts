interface Coordinates {
    lat: number;
    lng: number;
}

export interface ScoredResult {
    location: string;
    coordinates?: Coordinates;
    distance?: number;
    matchScore: number;
    [key: string]: any;
}

function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const distance = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    console.log('Distance calculation:', { coord1, coord2, distance });
    return distance;
}

interface ScoreWeights {
    location: number;
    skills: number;
    availability: number;
    interest: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
    location: 0.4,
    skills: 0.3,
    availability: 0.2,
    interest: 0.1
};

function calculateSkillsScore(userSkills: string[], opportunitySkills: string[]): number {
    console.log('Calculating skills score:', { userSkills, opportunitySkills });
    if (!userSkills?.length || !opportunitySkills?.length) return 0;
    const matches = userSkills.filter(skill => 
        opportunitySkills.includes(skill.toLowerCase())
    ).length;
    const score = matches / Math.max(userSkills.length, opportunitySkills.length);
    console.log('Skills score:', score);
    return score;
}

function calculateAvailabilityScore(userAvailability: string[], oppAvailability: string[]): number {
    console.log('Calculating availability score:', { userAvailability, oppAvailability });
    if (!userAvailability?.length || !oppAvailability?.length) return 0;
    const matches = userAvailability.filter(time => 
        oppAvailability.includes(time)
    ).length;
    const score = matches / Math.max(userAvailability.length, oppAvailability.length);
    console.log('Availability score:', score);
    return score;
}

function calculateInterestScore(userInterests: string[], oppCategory: string): number {
    console.log('Calculating interest score:', { userInterests, oppCategory });
    if (!userInterests?.length || !oppCategory) return 0;
    const score = userInterests.includes(oppCategory.toLowerCase()) ? 1 : 0;
    console.log('Interest score:', score);
    return score;
}

export function scoreResults(
    results: any[], 
    userCoords: Coordinates,
    userPreferences?: {
        skills?: string[];
        availability?: string[];
        interests?: string[];
    },
    weights: ScoreWeights = DEFAULT_WEIGHTS
): ScoredResult[] {
    console.log('Starting score calculation with:', {
        resultsCount: results.length,
        userCoords,
        userPreferences,
        weights
    });
    
    const MAX_DISTANCE = 100;
    
    return results
        .map(result => {
            console.log('\nScoring opportunity:', result.title || result.name);
            
            // Calculate location score
            const locationScore = result.coordinates ? 
                Math.max(0, 1 - (calculateDistance(userCoords, result.coordinates) / MAX_DISTANCE)) : 0;
            
            // Calculate other scores
            const skillsScore = calculateSkillsScore(
                userPreferences?.skills || [], 
                result.requiredSkills || []
            );
            
            const availabilityScore = calculateAvailabilityScore(
                userPreferences?.availability || [],
                result.availability || []
            );
            
            const interestScore = calculateInterestScore(
                userPreferences?.interests || [],
                result.category || ''
            );
            
            // Calculate weighted total score
            const totalScore = 
                (locationScore * weights.location) +
                (skillsScore * weights.skills) +
                (availabilityScore * weights.availability) +
                (interestScore * weights.interest);
            
            const finalResult = {
                ...result,
                distance: result.coordinates ? 
                    calculateDistance(userCoords, result.coordinates) : undefined,
                matchScore: totalScore,
                scores: {
                    location: locationScore,
                    skills: skillsScore,
                    availability: availabilityScore,
                    interest: interestScore
                }
            };
            
            console.log('Final scores for opportunity:', {
                title: result.title || result.name,
                scores: finalResult.scores,
                totalScore
            });
            
            return finalResult;
        })
        .sort((a, b) => b.matchScore - a.matchScore);
}
