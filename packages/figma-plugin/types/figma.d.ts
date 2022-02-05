/// <reference types="@figma/plugin-typings/plugin-api" />

declare global {
  const figma: PluginAPI;
  const __html__: string;
  const __uiFiles__: {
    [key: string]: string;
  };
}

export {};
