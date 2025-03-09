import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";

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

// Get coordinates from Google Geocoding API
async function getCoordinates(address: string): Promise<{lat: number, lng: number} | null> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
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

  return score;
}