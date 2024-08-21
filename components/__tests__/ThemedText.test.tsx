import { ThemedText } from "@/components/ThemedText";
import { render, screen } from "@testing-library/react-native";

it("renders correctly", () => {
  render(<ThemedText>Snapshot test!</ThemedText>);
  expect(screen.toJSON()).toMatchSnapshot();
});
