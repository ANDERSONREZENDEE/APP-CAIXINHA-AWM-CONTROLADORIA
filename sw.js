const CACHE_NAME = 'caixinha-wm-v4'; // Atualizado para v4 para limpar o cache velho

// Arquivos para guardar offline
const arquivosParaGuardar = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './LOGOTIPO.jpg',
  './Captura de tela 2026-02-13 132630.jpg',
  './icone_v3.png',
  './OLHOABERTO.png',
  './OLHOFECHADO_V2.png',
  './atalho.png' // Adicionado o ícone de atalho para funcionar 100% offline
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(arquivosParaGuardar))
  );
  // Força o Service Worker a assumir o controle imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', evento => {
  // Varre a memória e apaga os caches antigos para não dar conflito
  evento.waitUntil(
    caches.keys().then(nomesCaches => {
      return Promise.all(
        nomesCaches.map(nomeCache => {
          if (nomeCache !== CACHE_NAME) {
            console.log('Apagando cache antigo:', nomeCache);
            return caches.delete(nomeCache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    // A MÁGICA OFFLINE AQUI: ignoreSearch: true faz o "?tela=planilha" ser ignorado e carregar o index.html offline!
    caches.match(evento.request, { ignoreSearch: true })
      .then(resposta => resposta || fetch(evento.request))
  );
});
