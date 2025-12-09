'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ImageCropModalProps {
    image: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
    userId: string;
}

export default function ImageCropModal({
    image,
    onCropComplete,
    onCancel,
    userId,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!croppedAreaPixels) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const img = new Image();
        img.src = image;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImage = await createCroppedImage();
            if (!croppedImage) return;

            // Convert base64 to blob
            const response = await fetch(croppedImage);
            const blob = await response.blob();

            // Upload to ImageBB
            const formData = new FormData();
            formData.append('image', blob);
            formData.append('userId', userId);

            const uploadResponse = await fetch('/api/profile/image', {
                method: 'POST',
                body: formData,
            });

            const data = await uploadResponse.json();

            if (data.success && data.url) {
                onCropComplete(data.url);
            } else {
                alert('Resim yüklenemedi');
            }
        } catch (error) {
            console.error('Crop error:', error);
            alert('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <h3 className="text-lg font-bold mb-4">Resmi Kırp</h3>

                <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteCallback}
                    />
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Yakınlaştır</label>
                    <Slider
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        min={1}
                        max={3}
                        step={0.1}
                        className="w-full"
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        İptal
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
