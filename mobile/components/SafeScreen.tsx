import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";
import { PropsWithChildren } from "react";

const SafeScreen = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: COLORS.background,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
