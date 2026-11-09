//ESTO ES UN LINTER: a la hora de compilar va a verificar que archivos estan bien escritos
const js = require("@eslint/js");

module.exports = [
    {
        files: ["src/**/*.js", "scripts/**/*.js"],
        ...js.configs.recommended,
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                __dirname: "readonly",
                console: "readonly",
                module: "readonly",
                process: "readonly",
                require: "readonly",
            },
        },
    },
];

/*El archivo eslint.config.js es un archivo de configuración para ESLint, una herramienta de análisis estático
  de código que ayuda a identificar y corregir problemas en el código JavaScript. En este caso, el archivo 
 está configurando ESLint para que analice archivos JavaScript ubicados en las carpetas "src" y "scripts".*/