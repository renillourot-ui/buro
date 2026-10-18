import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "__pycache__/**",
      "ai_client.py",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];
