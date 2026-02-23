/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff4d4d", // Example brand color
                secondary: "#1a1a1a",
            },
        },
    },
    plugins: [],
}
