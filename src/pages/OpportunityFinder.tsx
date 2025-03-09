// volunteerSearch.ts
import { db } from '../firebase/initFirebase';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';

// Replace with your actual Google API key
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// Interface for volunteer opportunity data
interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  date: Date;
  contact: string;
  // Add other fields as needed
}

// Extended interface to include distance and score in results
interface VolunteerOpportunityWithScore extends VolunteerOpportunity {
  distance: number;
  score: number;
}

// Function to geocode an address using Google Geocoding API
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Calculate distance between two points using the Haversine formula (in miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Calculate score based on distance
function calculateDistanceScore(distance: number): number {
  if (distance <= 5) {
    return 3; // 5 miles or less: score 3
  } else if (distance <= 15) {
    return 2; // 6-15 miles: score 2
  } else if (distance <= 25) {
    return 1; // 16-25 miles: score 1
  } else {
    return 0; // More than 25 miles: score 0
  }
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Main function to find volunteer opportunities within specified radius
export async function findNearbyVolunteerOpportunities(
  address: string,
  maxRadiusMiles: number = 25 // Extended to 25 miles to include all scoring ranges
): Promise<VolunteerOpportunityWithScore[]> {
  try {
    // Step 1: Geocode the address to get coordinates
    const geocodedLocation = await geocodeAddress(address);
    
    if (!geocodedLocation) {
      throw new Error('Failed to geocode the provided address');
    }
    
    const { lat, lng, formattedAddress } = geocodedLocation;
    console.log(`Searching for opportunities near ${formattedAddress}`);
    
    // Step 2: Get all volunteer opportunities from Firebase
    const opportunitiesRef = collection(db, 'volunteerOpportunities');
    const opportunitiesSnapshot = await getDocs(opportunitiesRef);
    
    // Step 3: Filter opportunities within the radius and calculate scores
    const nearbyOpportunities: VolunteerOpportunityWithScore[] = [];
    
    opportunitiesSnapshot.forEach((doc) => {
      const opportunity = doc.data() as Omit<VolunteerOpportunity, 'id'>;
      
      // Calculate distance between user location and opportunity location
      const distance = calculateDistance(
        lat,
        lng,
        opportunity.location.latitude,
        opportunity.location.longitude
      );
      
      // If within max radius, add to results with appropriate score
      if (distance <= maxRadiusMiles) {
        const score = calculateDistanceScore(distance);
        
        nearbyOpportunities.push({
          id: doc.id,
          ...opportunity,
          distance: distance,
          score: score
        });
      }
    });
    
    // Sort by score (highest first), then by distance (closest first) for ties
    nearbyOpportunities.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Sort by score (descending)
      }
      return a.distance - b.distance; // If scores are equal, sort by distance (ascending)
    });
    
    return nearbyOpportunities;
  } catch (error) {
    console.error('Error finding nearby volunteer opportunities:', error);
    throw error;
  }
}

// Function that uses the search
export async function searchVolunteerOpportunities(address: string): Promise<VolunteerOpportunityWithScore[]> {
  try {
    const opportunities = await findNearbyVolunteerOpportunities(address);
    return opportunities;
  } catch (error) {
    console.error('Error searching for volunteer opportunities:', error);
    return [];
  }
}