// src/pages/Bulletins.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Bulletins = () => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        console.log("Firebase'den bültenler çekiliyor...");
        const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const bulletinsData = querySnapshot.docs.map(doc => {
          console.log("Çekilen bülten belge ID:", doc.id, "Veri:", doc.data());
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        setBulletins(bulletinsData);
        console.log("Çekilen toplam bülten sayısı:", bulletinsData.length);
      } catch (err) {
        console.error("Bültenler çekilirken hata oluştu:", err);
        setError("Bültenler yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
        console.log("Bülten yüklemesi tamamlandı. Loading durumu:", false);
      }
    };

    fetchBulletins();
  }, [db]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-nuper-blue">Bültenler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-center text-nuper-blue mb-10">Tüm Bültenler</h1>
        
        {bulletins.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Henüz bülten bulunamadı.</p>
        ) : (
          // Burası tek sütunlu liste düzeni için güncellendi
          <div className="flex flex-col gap-8">
            {bulletins.map((bulletin) => (
              <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="block w-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row h-full">
                  {bulletin.image && (
                    <img
                      src={bulletin.image}
                      alt={bulletin.title}
                      className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                    />
                  )}
                  <div className="p-6 flex-grow flex flex-col justify-between md:w-2/3">
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-nuper-dark-blue mb-2">
                        {bulletin.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4">
                        {bulletin.date} - {bulletin.author}
                      </p>
                      {/* İçeriğin tamamını göstermek için line-clamp-3 kaldırıldı */}
                      <p className="text-gray-700 text-base">
                        {bulletin.content}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className="text-nuper-blue hover:underline font-medium">
                        Devamını Oku
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bulletins;