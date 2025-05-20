import React from 'react';

const bulletins = [
  { id: '1', title: 'Yaz Dönemi Yarışmaları', date: '1 Haziran 2025', summary: 'Bu yaz katılabileceğin en heyecan verici yarışmalar burada!' },
  { id: '2', title: 'Yeni Atölye Programları', date: '15 Haziran 2025', summary: 'Sanat ve teknoloji atölyeleri için kayıtlar başladı.' },
  { id: '3', title: 'Burs Duyuruları', date: '1 Temmuz 2025', summary: '2025 burs fırsatları açıklandı, hemen başvur!' },
];

const Bulletins = ({ darkMode }) => {
  return (
    <section className={`${darkMode ? 'bg-nuper-dark-gray' : 'bg-white'} py-16`}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className={`text-3xl font-heading font-bold text-center mb-6 ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Bültenler</h2>
        <div className="space-y-6">
          {bulletins.map((bulletin) => (
            <div key={bulletin.id} className={`${darkMode ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-gray-50'} p-6 rounded-lg shadow-md`}>
              <h3 className={`text-xl font-heading font-semibold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{bulletin.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{bulletin.date}</p>
              <p className="mt-2 text-gray-700 dark:text-nuper-light-text">{bulletin.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bulletins;