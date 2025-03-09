import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";
import { LocationEnrichmentData, addressEnricher } from "@/lib/components/enricher";


function hasOverlap(userArray: string[] | undefined, requiredArray: string[] | undefined): boolean {
  if (!userArray || userArray.length === 0) return false;
  if (!requiredArray || requiredArray.length === 0) return false;
  return requiredArray.some((req) => userArray.includes(req));
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

const getCoordinates = async (location: string): Promise<{lat: number, lng: number} | null> => {
  if (!location) return null;

  try {
    const res = await fetch('/api/location-enrichment?'
      + new URLSearchParams({ name: location }));
    const data: LocationEnrichmentData = await res.json();
    
    if (data.coordinates) {
      return {
        lat: data.coordinates.lat,
        lng: data.coordinates.lng
      };
    }
    return null;
  } catch (error) {
    console.error("Error enriching location:", error);
    return null;
  }
}

export async function calculateMatchScore(posting: Posting, user: UserProfile | null): Promise<number> {
  // If there's no logged-in user or no profile, we can give a 0 score
  if (!user) return 0;

  let score = 0;

  // 1. Interests
  if (posting.requiredInterests && posting.requiredInterests.length > 0) {
    if (hasOverlap(user.interests, posting.requiredInterests)) {
      score++;
    }
  }
  
  // 2. Skills
  if (posting.requiredSkills && posting.requiredSkills.length > 0) {
    if (hasOverlap(user.skills, posting.requiredSkills)) {
      score++;
    }
  }

  // 3. Availability
  if (posting.requiredAvailability && posting.requiredAvailability.length > 0) {
    if (user.availability === posting.requiredAvailability) {
      score++;
    }
  }

  // 4. Location - with distance-based scoring
  if (posting.requiredLocation && user.address) {
    const userCoords = await getCoordinates(user.address);
    const postingCoords = await getCoordinates(posting.requiredLocation);

    console.log(userCoords, postingCoords);
    
    if (userCoords && postingCoords) {
      const distance = calculateDistance(
        userCoords.lat, 
        userCoords.lng, 
        postingCoords.lat, 
        postingCoords.lng
      );
      
      // Apply distance-based scoring
      if (distance <= 5) {
        score += 3; // Within 5 miles
      } else if (distance <= 15) {
        score += 2; // Within 15 miles
      } else if (distance <= 25) {
        score += 1; // Within 25 miles
      }
    }
  }

  // 5. Age - high school opportunities


  return score;
}