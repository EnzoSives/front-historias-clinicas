module.exports = {
  apps: [
    {
      name: "Front",
      script: "npm",
      args: "run start:pwa",
      watch: true, // reiniciar automáticamente la aplicación al cambiar los archivos
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
