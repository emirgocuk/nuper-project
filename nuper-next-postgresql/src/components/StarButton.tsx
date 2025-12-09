'use client';

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleEventFeatured } from "@/actions/events";
import { useState } from "react";

interface StarButtonProps {
    eventId: string;
    isFeatured: boolean;
}

export default function StarButton({ eventId, isFeatured }: StarButtonProps) {
    const [featured, setFeatured] = useState(isFeatured);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleEventFeatured(eventId, featured);
            setFeatured(!featured);
        } catch (error) {
            console.error("Failed to toggle featured:", error);
            alert("Öne çıkarma durumu değiştirilemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className="hover:bg-transparent"
            title={featured ? "Öne Çıkandan Kaldır" : "Öne Çıkar"}
        >
            <Star
                className={`w-5 h-5 ${featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
        </Button>
    );
}
