export const coverageProvider = "v8";
export const moduleNameMapper = {
    // stub out CSS imports per Jest's recommendation
    "\\.(css)$": "identity-obj-proxy",
};