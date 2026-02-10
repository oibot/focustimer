import { requireNativeView } from 'expo';
import * as React from 'react';

import { LiveActivitiesControllerViewProps } from './LiveActivitiesController.types';

const NativeView: React.ComponentType<LiveActivitiesControllerViewProps> =
  requireNativeView('LiveActivitiesController');

export default function LiveActivitiesControllerView(props: LiveActivitiesControllerViewProps) {
  return <NativeView {...props} />;
}
