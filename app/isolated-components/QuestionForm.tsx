import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { QuestionForm as Component } from "../../components/QuestionForm";

type Props = ComponentProps<typeof Component>;

const COPY = {
  lede: "Escribí lo que querés preguntarle a las cartas.",
  placeholder: "¿Qué necesito saber sobre…?",
  label: "Tu pregunta",
  submitLabel: "Consultar a las cartas",
};

const scenarios: Record<string, Props> = {
  // Nothing written yet, so the button is dim — the draw is gated on asking.
  Empty: {
    ...COPY,
    value: "",
    canSubmit: false,
    onChange: () => {},
    onSubmit: () => {},
  },
  // A question written: the button comes alive.
  Filled: {
    ...COPY,
    value: "¿Qué necesito saber sobre mi trabajo?",
    canSubmit: true,
    onChange: () => {},
    onSubmit: () => {},
  },
  English: {
    lede: "Write what you want to ask the cards.",
    placeholder: "What do I need to know about…?",
    label: "Your question",
    submitLabel: "Ask the cards",
    value: "What do I need to know about my work?",
    canSubmit: true,
    onChange: () => {},
    onSubmit: () => {},
  },
};

export default function IsolatedComponent() {
  const { s = "Empty" } = useLocalSearchParams<{ s?: string }>();
  const props = scenarios[s];
  if (!props) {
    return (
      <View nativeID="codeyam-capture">
        <Text>Unknown scenario: {s}</Text>
      </View>
    );
  }
  return (
    <View nativeID="codeyam-capture">
      <Component {...props} />
    </View>
  );
}
