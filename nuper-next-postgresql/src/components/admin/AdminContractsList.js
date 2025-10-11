import React from 'react';
import { Link } from 'react-router-dom';

const AdminContractsList = () => {
    const contracts = [
        { id: 'terms_of_service', name: 'Kullanım Koşulları' },
        { id: 'privacy_policy', name: 'Gizlilik Politikası' },
        { id: 'cookie_policy', name: 'Çerez Politikası' },
    ];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">Sözleşme Yönetimi</h2>
            <div className="bg-white rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    {contracts.map(contract => (
                        <li key={contract.id} className="p-4 flex justify-between items-center">
                            <span className="font-medium text-gray-800">{contract.name}</span>
                            <Link 
                                to={`/admin/contracts/edit/${contract.id}`} 
                                className="text-indigo-600 hover:text-indigo-900 font-semibold"
                            >
                                Düzenle
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminContractsList;
