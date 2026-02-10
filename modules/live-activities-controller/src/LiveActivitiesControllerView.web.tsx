import * as React from 'react';

import { LiveActivitiesControllerViewProps } from './LiveActivitiesController.types';

export default function LiveActivitiesControllerView(props: LiveActivitiesControllerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
