import {
  areActivitiesEnabled,
  endActivity,
  startActivity,
  updateActivity,
} from "../src"
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native"
import { useState } from "react"

export default function App() {
  const [activityId, setActivityId] = useState<string | null>(null)
  const enabled = areActivitiesEnabled()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Constants">
          <Text>Enabled: {String(enabled)}</Text>
        </Group>
        <Group name="Functions">
          <Text>Activity ID: {activityId ?? "none"}</Text>
        </Group>
        <Group name="Async functions">
          <Button
            title="Start activity"
            onPress={async () => {
              const id = startActivity("Focus Only", 25 * 60)
              setActivityId(id)
            }}
          />
          <Button
            title="Update activity"
            onPress={async () => {
              await updateActivity(20 * 60, true)
            }}
          />
          <Button
            title="End activity"
            onPress={async () => {
              await endActivity(0, false)
              setActivityId(null)
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  )
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  )
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
}
