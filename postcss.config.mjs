/** @type {import("postcss-load-config").Config} */
const config = {
    plugins: {
        "@tailwindcss/postcss": {
            content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
        },
    },
};

export default config;
