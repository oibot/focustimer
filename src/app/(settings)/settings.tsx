import { Form, Host, Section, Text, Toggle } from "@expo/ui/swift-ui"
import { useLingui } from "@lingui/react/macro"
import { StyleSheet } from "react-native-unistyles"

import { useStore } from "@/state/store"

export default function Settings() {
  const { t } = useLingui()
  const { keepScreenAwake, setKeepScreenAwake } = useStore()

  return (
    <Host style={styles.container}>
      <Form>
        <Section
          title={t`Display`}
          footer={
            <Text>{t`Prevent the screen from turning off while a timer is running.`}</Text>
          }
        >
          <Toggle
            label={t`Keep Screen Awake`}
            isOn={keepScreenAwake}
            onIsOnChange={setKeepScreenAwake}
          />
        </Section>
      </Form>
    </Host>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
