import { registerWebModule, NativeModule } from 'expo';

import { LiveActivitiesControllerModuleEvents } from './LiveActivitiesController.types';

class LiveActivitiesControllerModule extends NativeModule<LiveActivitiesControllerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(LiveActivitiesControllerModule, 'LiveActivitiesControllerModule');
