export default function registerServiceWorker() {

  if ( 'production' !== process.env.NODE_ENV ) {
    return;
  }
  // Check if the serviceWorker Object exists in the navigator object ( means if browser supports SW )
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none', scope: '/' })
      .then((sw) => {console.log('Service worker registered', sw)})
      .catch((err) => {console.error(err)});

  }
}
