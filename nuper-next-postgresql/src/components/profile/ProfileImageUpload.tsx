'use client';

import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import ImageCropModal from './ImageCropModal';
import { Button } from '@/components/ui/button';
import { removeProfilePhoto } from '@/actions/profile';

interface ProfileImageUploadProps {
    currentImage?: string | null;
    userId: string;
}

export default function ProfileImageUpload({ currentImage, userId }: ProfileImageUploadProps) {
    const [showCrop, setShowCrop] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [displayImage, setDisplayImage] = useState(currentImage);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setShowCrop(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImageUrl: string) => {
        setDisplayImage(croppedImageUrl);
        setShowCrop(false);
    };

    const handleRemovePhoto = async () => {
        if (!confirm('Profil fotoğrafınızı kaldırmak istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true);
        try {
            await removeProfilePhoto();
            setDisplayImage(null);
        } catch (error) {
            console.error('Remove photo error:', error);
            alert('Fotoğraf kaldırılamadı');
        } finally {
            setLoading(false);
        }
    };

    const initials = "U";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-nuper-blue/10 flex items-center justify-center">
                    {displayImage ? (
                        <Image
                            src={displayImage}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-bold text-nuper-blue">{initials}</span>
                    )}
                </div>
                <label
                    htmlFor="profile-image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                    <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {displayImage && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <X className="w-4 h-4 mr-1" />
                    Fotoğrafı Kaldır
                </Button>
            )}

            {showCrop && selectedImage && (
                <ImageCropModal
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setShowCrop(false)}
                    userId={userId}
                />
            )}
        </div>
    );
}
