const CACHE_NAME = 'caixinha-wm-v3'; // Mudamos para v3 para forçar a atualização!

// Aqui nós dizemos ao celular exatamente quais arquivos ele deve guardar para usar offline
const arquivosParaGuardar = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './LOGOTIPO.jpg',
  './Captura de tela 2026-02-13 132630.jpg',
  './icone_v3.png',          // O nosso ícone novo e corrigido!
  './OLHOABERTO.png',        // Imagem do olho aberto
  './OLHOFECHADO_V2.png'     // Imagem do olho fechado
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
  // Varre a memória e apaga os caches antigos (v1, v2) para não dar conflito
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
    caches.match(evento.request)
      .then(resposta => resposta || fetch(evento.request))
  );
});
