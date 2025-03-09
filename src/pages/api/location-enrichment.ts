import { addressEnricher } from "@/lib/components/enricher";
import { scoreResults } from "@/lib/utils/matchScore";

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const name = url.searchParams.get("name");
        const userLat = parseFloat(url.searchParams.get("lat") || "0");
        const userLng = parseFloat(url.searchParams.get("lng") || "0");
        
        // Get additional preferences from query params
        const userPreferences = {
            skills: url.searchParams.get("skills")?.split(",") || [],
            availability: url.searchParams.get("availability")?.split(",") || [],
            interests: url.searchParams.get("interests")?.split(",") || []
        };

        if (name == null || !userLat || !userLng) {
            return new Response('Missing required parameters', {
                status: 400,
            });
        }

        console.log('Request parameters:', {
            name,
            coordinates: { lat: userLat, lng: userLng },
            userPreferences
        });

        const results = await addressEnricher(name);
        console.log('Raw results from enricher:', results);
        
        const scoredResults = scoreResults(
            Array.isArray(results) ? results : [results], 
            { lat: userLat, lng: userLng },
            userPreferences
        );
        
        console.log('Final scored and sorted results:', 
            scoredResults.map(r => ({
                title: r.title || r.name,
                matchScore: r.matchScore,
                scores: r.scores
            }))
        );
        
        return Response.json(scoredResults);
    }
    catch (e){
        console.error('Error in location-enrichment:', e);
        return new Response('Error', {
            status: 500,
        })
    }
}