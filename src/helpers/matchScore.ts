// helpers/matchScore.ts

import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";

function hasOverlap(userArray: string[] | undefined, requiredArray: string[] | undefined): boolean {
  if (!userArray || userArray.length === 0) return false;
  if (!requiredArray || requiredArray.length === 0) return false;
  return requiredArray.some((req) => userArray.includes(req));
}

export function calculateMatchScore(posting: Posting, user: UserProfile | null): number {
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

  // 4. Location
  if (posting.requiredLocation) {
    // check for exact match or some partial logic if you prefer
    if (
      user.address &&
      user.address.toLowerCase() === posting.requiredLocation.toLowerCase()
    ) {
      score++;
    }
  }

  return score;
}