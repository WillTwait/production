import Button from "@/components/Button";
import { Text } from "@/components/Text";
import { useTheme } from "@/hooks/useTheme";
import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Circle, SwitchCamera, X } from "lucide-react-native";
import { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import {
  type GestureEvent,
  PinchGestureHandler,
  type PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";

import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

let camera: CameraView;

export default function TendyCamera() {
  const { checklistId } = useLocalSearchParams<{ checklistId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [zoom, setZoom] = useState(0);

  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  function toggleCameraFacing() {
    setFacing(current => (current === "back" ? "front" : "back"));
  }

  const changeZoom = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
    const velocity = event.nativeEvent.velocity / 20;

    const delta = velocity * (Platform.OS === "ios" ? 0.01 : 100);
    let newZoom = zoom + delta;

    newZoom = Math.max(0, newZoom);
    newZoom = Math.min(0.5, newZoom);

    setZoom(newZoom);
  };

  async function takePhoto() {
    const photo = await camera.takePictureAsync({
      quality: 0.5,
    });

    if (photo) {
      await savePhoto(photo.uri, checklistId);
    } //else show error
  }

  //TODO: abstract this out into the client once we build that
  async function savePhoto(filepath: string, checklistInstanceId: string) {
    const workingDirectory = `${FileSystem.documentDirectory}checklist/${process.env.EXPO_PUBLIC_TENDREL_STAGE ?? "dev"}/`;

    const checklistDir: string = `${workingDirectory}checklistDir/${checklistInstanceId}`;

    const directory = await FileSystem.getInfoAsync(checklistDir);

    try {
      if (directory.exists) {
        const newFilePath: string = `${checklistDir}/${checklistInstanceId}_${Date.now()}.jpg`;

        await FileSystem.copyAsync({
          from: filepath,
          to: newFilePath,
        });
      } else {
        await FileSystem.makeDirectoryAsync(checklistDir, {
          intermediates: true,
        });

        await FileSystem.copyAsync({
          from: filepath,
          to: `${checklistDir}/${checklistInstanceId}_${Math.floor(Date.now())}.jpg`,
        });
      }
      toast.success("Photo added!", {
        duration: 500,
        style: { marginTop: 50 },
      });
    } catch (_error) {
      //FIXME: show toast
    }
  }

  return (
    <View
      style={{ marginTop: Platform.OS === "android" ? insets.top : undefined }}
    >
      {!permission.granted ? (
        <View
          style={{
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            We need your permission to show the camera
          </Text>
          <Button
            onPress={requestPermission}
            variant="filled"
            title="Grant Permission"
          />
        </View>
      ) : (
        <PinchGestureHandler onGestureEvent={event => changeZoom(event)}>
          {isFocused && (
            <CameraView
              ref={(r: CameraView) => {
                camera = r;
              }}
              style={{ height: "100%", overflow: "hidden", zIndex: 1 }}
              facing={facing}
              zoom={zoom}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <TouchableOpacity onPress={() => toggleCameraFacing()}>
                  <SwitchCamera color={colors.tendrel_constants.cream} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()}>
                  <X color={colors.tendrel_constants.cream} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }} />
              <View
                style={{
                  alignItems: "center",
                  paddingBottom: 50,
                }}
              >
                <TouchableOpacity onPress={async () => await takePhoto()}>
                  <Circle color={colors.tendrel_constants.cream} size={75} />
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </PinchGestureHandler>
      )}
    </View>
  );
}
