import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { View } from "@/components/View";
import { addTestIdentifiers } from "@/util/add-test-id";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: string;
  testId?: string;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  testId,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollOffset.value,
        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
        [HEADER_HEIGHT * 1.5, HEADER_HEIGHT, HEADER_HEIGHT / 2],
        Extrapolate.CLAMP,
      ),
    };
  });

  const headerTranslateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 2],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container} {...addTestIdentifiers(testId)}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={{ height: HEADER_HEIGHT }} />

        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: headerBackgroundColor,
          },
          headerAnimatedStyle,
          headerTranslateY,
        ]}
      >
        {headerImage}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 42,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 30,
    overflow: "hidden",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  content: {
    flex: 1,
    padding: 42,
    gap: 16,
  },
});
