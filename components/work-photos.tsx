import { FlatList, Modal, StyleSheet, TouchableOpacity } from "react-native";
import AwesomeGallery, {
  type GalleryRef,
  type RenderItemInfo,
} from "react-native-awesome-gallery";
import { View } from "./View";

import useThemeContext from "@/hooks/useTendyTheme";
import { Image } from "expo-image";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Plus, PlusIcon } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import type { ActionSheetRef } from "react-native-actions-sheet";
import Button from "./Button";
import { Text } from "./Text";

import * as FileSystem from "expo-file-system";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  checklistId: string;
}

const renderItem = ({
  item,
  setImageDimensions,
}: RenderItemInfo<{ uri: string }>) => {
  return (
    <Image
      source={item.uri}
      style={StyleSheet.absoluteFillObject}
      contentFit="contain"
      onLoad={e => {
        const { width, height } = e.source;
        setImageDimensions({ width, height });
      }}
    />
  );
};

export function WorkPhotos({ checklistId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { bottom } = useSafeAreaInsets();

  const [photos, setPhotos] = useState<string[]>();
  const { colors } = useThemeContext();
  // const modalRef = useRef<ActionSheetRef>(null);
  const gallery = useRef<GalleryRef>(null);

  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { push } = useRouter();
  const workingDirectory = `${FileSystem.documentDirectory}checklist/${process.env.EXPO_PUBLIC_TENDREL_STAGE ?? "dev"}/`;

  const checklistDir: string = `${workingDirectory}checklistDir/${checklistId}`;

  useFocusEffect(
    useCallback(() => {
      const checkForPhotos = async () => {
        const directory = await FileSystem.getInfoAsync(checklistDir);

        if (directory.exists) {
          const dirPhotos = await FileSystem.readDirectoryAsync(checklistDir);
          console.log(dirPhotos);
          setPhotos(dirPhotos);
        }
      };

      checkForPhotos();

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [checklistDir]),
  );

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  const closeGallery = () => {
    setIsVisible(false);
  };

  const renderThumbnail = ({
    item,
    index,
  }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => openGallery(index)}
      style={{ width: 50, height: 50, margin: 5 }}
    >
      <Image
        source={{ uri: `${checklistDir}/${item}` }}
        style={{ height: "100%", width: "100%", borderRadius: 5 }}
      />
    </TouchableOpacity>
  );

  return (
    <>
      {photos && photos?.length > 0 ? (
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
          }}
        >
          <FlatList
            data={photos}
            style={{ flex: 1 }}
            horizontal
            renderItem={renderThumbnail}
            ListHeaderComponent={
              <TouchableOpacity
                onPress={() =>
                  push({
                    pathname: "/(home)/camera",
                    params: { checklistId: checklistId.toString() },
                  })
                }
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: colors.tendrel.interactive2.gray,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <PlusIcon size={40} color={colors.tendrel.button1.gray} />
              </TouchableOpacity>
            }
            keyExtractor={(_, index) => index.toString()}
          />
          <Modal visible={isVisible} transparent={true}>
            <AwesomeGallery
              ref={gallery}
              data={photos.map(ph => ({ uri: `${checklistDir}/${ph}` }))}
              renderItem={renderItem}
              onIndexChange={setCurrentIndex}
              initialIndex={currentIndex}
              onSwipeToClose={closeGallery}
              keyExtractor={(_item, index) => index.toString()}
              doubleTapEnabled
              onTap={() => setToolbarVisible(!toolbarVisible)}
            />
            {toolbarVisible ? (
              <Animated.View
                entering={FadeInDown.duration(250)}
                exiting={FadeOutDown.duration(250)}
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                  bottom: 0,

                  height: bottom + 75,
                  paddingBottom: bottom,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      gallery.current?.setIndex(
                        currentIndex === 0
                          ? photos.length - 1
                          : currentIndex - 1,
                      )
                    }
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      gallery.current?.setIndex(
                        currentIndex === photos.length - 1
                          ? 0
                          : currentIndex + 1,
                        true,
                      )
                    }
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                      }}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : undefined}
          </Modal>
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          <Button
            title="Add Photo"
            onPress={() => {
              // modalRef.current?.show();
              // setModalOpen(true);
              push({
                pathname: "/(home)/camera",
                params: { checklistId: checklistId.toString() },
              });
            }}
            variant="filled"
            icon={<Plus color={colors.tendrel.background2.color} />}
          />
        </View>
      )}
    </>
  );
}
