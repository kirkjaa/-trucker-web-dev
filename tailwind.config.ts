import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        multipleChoiceCombobox: "685px",
        signatureModal: "48rem",
        modal: "40rem",
      },
      maxWidth: {
        modal: "85rem",
        modal2: "110rem",
      },
      screens: {
        "01": "1366px",
        "02": "1440px",
        "full-hd": "1920px",
        "2k": "1921px",
      },
      boxShadow: {
        "login-form": "0 4px 40px 0 hsla(var(--box-shadow-01))",
        main: "0 2px 5.5px 0 hsla(var(--box-shadow-02))",
        table: "0 5px 14px 0 hsla(var(--box-shadow-03))",
        card: "0 12px 48px -6px hsla(var(--box-shadow-04))",
      },
      dropShadow: {
        "main-button": "0 8px 16px 0 hsla(var(--secondary-indigo-01-shadow))",
        "secondary-button":
          "0 8px 16px 0 hsla(var--secondary-teal-green-main-shadow))",
        "delete-button": "0 8px 16px 0 hsla(var(--urgent-fail-02-shadow))",
      },
      backgroundImage: {
        "background-inside": "url('/images/background-inside.png')",
        "background-login": "url('/images/background-login.png')",
        "background-login01": "url('/images/background-login-01.png')",
        "background-login02": "url('/images/background-login-02.png')",
        "background-sidebar": "url('/images/background-sidebar.png')",
        "gradient-01":
          "linear-gradient(180deg, hsla(var(--gradient-01-start)), hsla(var(--gradient-01-end)))",
        "gradient-02":
          "linear-gradient(90deg, hsla(var(--gradient-02-start)), hsla(var(--gradient-02-end)))",
        "gradient-03":
          "linear-gradient(90deg, hsla(var(--gradient-03-start)), hsla(var(--gradient-03-end)))",
        "gradient-04":
          "linear-gradient(90deg, hsla(var(--gradient-04-start)), hsla(var(--gradient-04-end)))",
      },
      colors: {
        primary: {
          "oxley-green-main": "hsla(var(--primary-oxley-green-main))",
          "oxley-green-01": "hsla(var(--primary-oxley-green-01))",
          "oxley-green-02": "hsla(var(--primary-oxley-green-02))",
          "oxley-green-03": "hsla(var(--primary-oxley-green-03))",
          "oxley-green-04": "hsla(var(--primary-oxley-green-04))",
          "blue-main": "hsla(var(--primary-blue-main))",
          "blue-01": "hsla(var(--primary-blue-01))",
          "blue-02": "hsla(var(--primary-blue-02))",
          "blue-03": "hsla(var(--primary-blue-03))",
          "blue-04": "hsla(var(--primary-blue-04))",
        },
        secondary: {
          "caribbean-green-main": "hsla(var(--secondary-caribbean-green-main))",
          "caribbean-green-main-hover":
            "hsla(var(--secondary-caribbean-green-main-hover))",
          "caribbean-green-01": "hsla(var(--secondary-caribbean-green-01))",
          "caribbean-green-02": "hsla(var(--secondary-caribbean-green-02))",
          "caribbean-green-03": "hsla(var(--secondary-caribbean-green-03))",
          "caribbean-green-04": "hsla(var(--secondary-caribbean-green-04))",
          "teal-green-main": "hsla(var(--secondary-teal-green-main))",
          "teal-green-01": "hsla(var(--secondary-teal-green-01))",
          "teal-green-02": "hsla(var(--secondary-teal-green-02))",
          "teal-green-03": "hsla(var(--secondary-teal-green-03))",
          "teal-green-04": "hsla(var(--secondary-teal-green-04))",
          "teal-green-hover": "hsla(var(--secondary-teal-green-hover))",
          "indigo-main": "hsla(var(--secondary-indigo-main))",
          "indigo-01": "hsla(var(--secondary-indigo-01))",
          "indigo-02": "hsla(var(--secondary-indigo-02))",
          "indigo-03": "hsla(var(--secondary-indigo-03))",
          "indigo-04": "hsla(var(--secondary-indigo-04))",
          "indigo-hover": "hsla(var(--secondary-indigo-hover))",
          "dark-gray-main": "hsla(var(--secondary-dark-gray-main))",
          "dark-gray-01": "hsla(var(--secondary-dark-gray-01))",
          "dark-gray-02": "hsla(var(--secondary-dark-gray-02))",
          "dark-gray-03": "hsla(var(--secondary-dark-gray-03))",
          "dark-gray-04": "hsla(var(--secondary-dark-gray-04))",
        },
        neutral: {
          "00": "hsla(var(--neutral-00))",
          "01": "hsla(var(--neutral-01))",
          "02": "hsla(var(--neutral-02))",
          "03": "hsla(var(--neutral-03))",
          "04": "hsla(var(--neutral-04))",
          "05": "hsla(var(--neutral-05))",
          "06": "hsla(var(--neutral-06))",
          "07": "hsla(var(--neutral-07))",
          "08": "hsla(var(--neutral-08))",
          "09": "hsla(var(--neutral-09))",
        },
        success: {
          "01": "hsla(var(--success-01))",
          "02": "hsla(var(--success-02))",
          "03": "hsla(var(--success-03))",
        },
        process: {
          "01": "hsla(var(--process-01))",
          "02": "hsla(var(--process-02))",
          "03": "hsla(var(--process-03))",
        },
        urgent: {
          "fail-01": "hsla(var(--urgent-fail-01))",
          "fail-02": "hsla(var(--urgent-fail-02))",
          "fail-03": "hsla(var(--urgent-fail-03))",
        },
        accept: {
          "01": "hsla(var(--accept-01))",
          "02": "hsla(var(--accept-02))",
          "03": "hsla(var(--accept-03))",
        },
        toast: {
          "info-border": "hsla(var(--info-border))",
          "info-background": "hsla(var(--info-background))",
          "success-border": "hsla(var(--success-border))",
          "success-background": "hsla(var(--success-background))",
          "warning-border": "hsla(var(--warning-border))",
          "warning-background": "hsla(var(--warning-background))",
          "error-border": "hsla(var(--error-border))",
          "error-background": "hsla(var(--error-background))",
        },
        sidebar: {
          "text-head": "hsla(var(--sidebar-text-head))",
          "user-card": "hsla(var(--sidebar-user-card))",
          "bg-hover": "hsla(var(--sidebar-background-hover))",
        },
        paginate: {
          text: "hsla(var(--gradient-03-start))",
        },
        component: {
          green: "hsla(var(--gradient-02-start))",
        },
        calendar: {
          selected: "hsla(var(--date-selected))",
          "day-text": "hsla(var(--day-text))",
          today: "hsla(var(--today))",
        },
        login: {
          "01": "hsla(var(--gradient-03-start))",
        },
        main: {
          "01": "hsla(var(--main))",
          "02": "hsla(var(--main02))",
        },
        modal: {
          "01": "hsla(var(--modal))",
          table: "hsla(var(--table))",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
