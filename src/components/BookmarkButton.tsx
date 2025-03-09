import { useState } from 'react';
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

export function BookmarkButton({ className = "" }: { className?: string }) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    return (
        <button 
            onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
            }}
            className={className}
        >
            {isBookmarked ? (
                <BookmarkSolid className="h-6 w-6 text-blue-500" />
            ) : (
                <BookmarkOutline className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            )}
        </button>
    );
}
