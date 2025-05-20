import React from 'react';
import { Link } from 'react-router-dom';

const Bulletins = ({ darkMode }) => {
  const bulletins = [
    {
      id: '1',
      title: 'Girişimcilik 101: İlk Adımlar',
      summary: 'Girişimcilik dünyasına adım atmak isteyenler için temel bilgiler ve ipuçları. İş fikri nasıl bulunur, ilk adımlar nasıl atılır? Bu bültende, sıfırdan bir iş kurmanın temel adımlarını ve dikkat edilmesi gereken noktaları ele alıyoruz. Yeni başlayanlar için pratik öneriler ve ilham verici hikayelerle dolu!',
      image: 'https://via.placeholder.com/300x200.png?text=Girişimcilik+101'
    },
    {
      id: '2',
      title: 'Yatırımcılarla Tanışma Rehberi',
      summary: 'Yatırımcılarla nasıl iletişim kurulur? Projenizi nasıl sunarsınız? Başarılı bir pitch için gerekenler. Bu bültende, yatırımcılarla etkili iletişim kurmanın yollarını ve bir pitch sırasında nelere dikkat etmeniz gerektiğini detaylıca anlatıyoruz. Fikrinizi hayata geçirmek için ihtiyacınız olan desteği nasıl alırsınız?',
      image: 'https://via.placeholder.com/300x200.png?text=Yatırımcı+Rehberi'
    },
    {
      id: '3',
      title: 'Sürdürülebilir Girişimcilik',
      summary: 'Çevre dostu iş modelleri ve sürdürülebilirlik odaklı girişimler nasıl oluşturulur? Yeşil ekonomi fırsatları. Bu bültende, çevresel etkileri göz önünde bulundurarak nasıl yenilikçi ve sürdürülebilir bir iş modeli oluşturabileceğinizi keşfedeceksiniz. Gelecek nesillere daha iyi bir dünya bırakmak için neler yapabilirsiniz?',
      image: 'https://via.placeholder.com/300x200.png?text=Sürdürülebilirlik'
    },
  ];

  return (
    <div className={`${darkMode ? 'dark bg-nuper-dark' : 'bg-nuper-gray'} min-h-screen font-sans text-gray-900 dark:text-nuper-light-text pt-24 pb-16`}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className={`text-4xl font-heading font-bold text-center mb-8 animate-fade-in ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Girişimcilik Bültenleri</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className={`${darkMode ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white'} rounded-xl border shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <img src={bulletin.image} alt={bulletin.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className={`text-xl font-heading font-semibold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'} mb-2`}>{bulletin.title}</h2>
                <p className="text-gray-700 dark:text-nuper-light-text leading-relaxed mb-4 line-clamp-3">{bulletin.summary}</p>
                <Link
                  to={`/bulletin/${bulletin.id}`}
                  className={`inline-block text-nuper-blue hover:underline font-heading`}
                >
                  Devamını Oku →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bulletins;