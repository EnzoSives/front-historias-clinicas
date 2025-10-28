module.exports = {
  apps: [
    {
      name: "Front",
      script: "npm",
      args: "start:pwa",
      watch: true, // reiniciar automáticamente la aplicación al cambiar los archivos
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
