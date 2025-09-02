function loadGoogleMapsSdk(key){
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    const id = 'gmaps-sdk';
    if (document.getElementById(id)) return resolve();
    const s = document.createElement('script');
    s.id = id;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Maps SDK yüklenemedi'));
    document.head.appendChild(s);
  });
};

module.exports = loadGoogleMapsSdk;