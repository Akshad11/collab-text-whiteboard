/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            height: {
                'screen-minus-50': 'calc(100vh - 100px)',
            },
            colors: {
                lightBg: '#f3f4f6',
                lightTNavBg: '#e2e4e9',
                lightAvabg: "#d4d4d4",
                lightLNavBg: "#f5ffff",
                lightLNavBghover: "#e0e0e0",
                lightCard: '#ffffff',
                lightText: '#1f2937',
                darkBg: '#1f2937',
                darkTNavBg: '#2c2f36',
                darkAvabg: "#2e3d52",
                darkLNavBg: "#181818",
                darkLNavBghover: "#333333",
                darkCard: '#2d3b49',
                darkText: '#ffffff',
            },
        },
    },
    plugins: [],
};
