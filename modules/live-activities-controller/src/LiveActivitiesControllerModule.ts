import { NativeModule, requireNativeModule } from 'expo';

import { LiveActivitiesControllerModuleEvents } from './LiveActivitiesController.types';

declare class LiveActivitiesControllerModule extends NativeModule<LiveActivitiesControllerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<LiveActivitiesControllerModule>('LiveActivitiesController');
