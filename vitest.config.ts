import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
        include: ["./src/tests/**/*.spec.{ts,tsx}"],
        coverage: {
            reportOnFailure: true,
            provider: "istanbul",
            reporter: ["text", "json", "html"],
            all: true,
            include: ["src/**/*.{ts,tsx}", "src/pages/storybook/customToastShowcase"],
            exclude: ["src/tests/*.d.ts", "src/setup.ts", "src/assets", "src/constants", "src/contexts", "src/interface", "src/pages", "src/routes", "src/services", "src/utils", "src/App.tsx", "src/main.tsx", "src/tests", "src/components/homepage"],
        },
        globals: true
    },
})