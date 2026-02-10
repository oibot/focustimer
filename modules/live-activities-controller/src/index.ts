// Reexport the native module. On web, it will be resolved to LiveActivitiesControllerModule.web.ts
// and on native platforms to LiveActivitiesControllerModule.ts
export { default } from './LiveActivitiesControllerModule';
export { default as LiveActivitiesControllerView } from './LiveActivitiesControllerView';
export * from  './LiveActivitiesController.types';
