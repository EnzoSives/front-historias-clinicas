// ecosystemFront.config.cjs
module.exports = {
  apps: [
    {
      name: "front-historias",
      script: "serve", // El comando que PM2 debe ejecutar
      args: [
        "-s", // Argumento 1: modo SPA
        "dist/pwa", // Argumento 2: la carpeta
        "-l", // Argumento 3: la bandera de 'listen'
        "tcp://127.0.0.1:3000", // Argumento 4: la dirección y puerto
      ],
      // Importante: le dice a PM2 dónde ejecutar el comando
      cwd: "/home/hcmadariaga.online/public_html/front-historias-clinicas",
    },
  ],
};
