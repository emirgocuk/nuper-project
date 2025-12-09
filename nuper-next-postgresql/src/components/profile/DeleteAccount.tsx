'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { deleteUserAccount } from '@/actions/user';

export default function DeleteAccount() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmation, setConfirmation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (confirmation !== 'onaylıyorum') {
            alert('Lütfen "onaylıyorum" yazın.');
            return;
        }

        setLoading(true);
        try {
            await deleteUserAccount();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Hesap silinirken bir hata oluştu.');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!showConfirm ? (
                <div>
                    <p className="text-sm text-gray-600 mb-4">
                        Hesabınızı kalıcı olarak silmek istiyorsanız aşağıdaki butona tıklayın.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setShowConfirm(true)}
                    >
                        Hesabımı Sil
                    </Button>
                </div>
            ) : (
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900">Dikkat!</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium block mb-2">
                                Devam etmek için "<strong>onaylıyorum</strong>" yazın:
                            </label>
                            <Input
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                placeholder="onaylıyorum"
                                className="max-w-xs"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowConfirm(false);
                                    setConfirmation('');
                                }}
                                disabled={loading}
                            >
                                İptal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={confirmation !== 'onaylıyorum' || loading}
                            >
                                {loading ? 'Siliniyor...' : 'Hesabı Sil'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
