import { Text } from "@/components/Text";

import { render, screen, waitFor } from "@testing-library/react-native";
import TendyThemeProvider from "../TendyThemeProvider";

import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("TendyThemeProvider", () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("light");
  });

  it("renders correctly", async () => {
    render(
      <TendyThemeProvider>
        <Text>Snapshot test!</Text>
      </TendyThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});
