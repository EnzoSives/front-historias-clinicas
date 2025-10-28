// ecosystemFront.config.cjs
module.exports = {
  apps: [
    {
      name: "front-historias",
      script: "serve",

      // Argumentos en el orden correcto: Banderas primero, ruta al final.
      args: [
        "-s",
        "-l",
        "tcp://127.0.0.1:3000",
        "dist/pwa", // <--- La ruta va al final
      ],

      cwd: "/home/hcmadariaga.online/public_html/front-historias-clinicas",
    },
  ],
};
