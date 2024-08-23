const colors: Record<ColorThemeName, ThemeColors> = {
  light: {
    text: {
      default: "#11181C",
    },
    tint: "#0a7ea4",
    icon: "#687076",
    backgrounds: {
      default: "#fff",
    },
    tendrel_constants: {
      cream: "#f3eae0",
      yellow: "#fdb455",
      green: "#87a19a",
      red: "#c13752",
      purple: "#2a283e",
    },
    tendrel: {
      background1: { color: "#FDFDFE", gray: "#FCFCFD" },
      background2: { color: "#F9F9FC", gray: "#F9F9FB" },
      interactive1: { color: "#F0F0F7", gray: "#EFF0F3" },
      interactive2: { color: "#E8E7F4", gray: "#E7E8EC" },
      interactive3: { color: "#DFDEF0", gray: "#E0E1E6" },
      border1: { color: "#D4D3EB", gray: "#D8D9E0" },
      border2: { color: "#C6C4E1", gray: "#CDCED7" },
      border3: { color: "#B0ADD3", gray: "#B9BBC6" },
      button1: { color: "#2A283E", gray: "#8B8D98" },
      button2: { color: "#3D3C53", gray: "#80828D" },
      text1: { color: "#636082", gray: "#62636C" },
      text2: { color: "#27253B", gray: "#1E1F24" },
    },
  },
  dark: {
    text: {
      default: "#fff",
    },
    tint: "#fff",
    icon: "#9BA1A6",
    backgrounds: {
      default: "#151718",
    },
    //same as light until i figure out light and dark variants
    tendrel_constants: {
      cream: "#f3eae0",
      yellow: "#fdb455",
      green: "#87a19a",
      red: "#c13752",
      purple: "#2a283e",
    },
    tendrel: {
      background1: { color: "#111016", gray: "#111113" },
      background2: { color: "#18181F", gray: "#19191B" },
      interactive1: { color: "#242232", gray: "#222325" },
      interactive2: { color: "#2C2A40", gray: "#292A2E" },
      interactive3: { color: "#34324A", gray: "#303136" },
      border1: { color: "#3E3C56", gray: "#393A40" },
      border2: { color: "#4C4A67", gray: "#46484F" },
      border3: { color: "#625F84", gray: "#5F606A" },
      button1: { color: "#6C6990", gray: "#6C6E79" },
      button2: { color: "#5F5C81", gray: "#797B86" },
      text1: { color: "#B3B0DA", gray: "#B2B3BD" },
      text2: { color: "#E7E6F4", gray: "#EEEEF0" },
    },
  },
};

export default colors;

export type ThemeColors = {
  text: {
    default: string;
  };
  tint: string;
  icon: string;
  backgrounds: {
    /** white in light mode, dark in dark mode */
    default: string;
    // soft: string;
    // /** dark in light mode, light in dark mode */
    // strong: string;
    // primary: string;
    // inverted: string;
  };
  tendrel: {
    background1: {
      color: string;
      gray: string;
    };
    background2: {
      color: string;
      gray: string;
    };
    interactive1: {
      color: string;
      gray: string;
    };
    interactive2: {
      color: string;
      gray: string;
    };
    interactive3: {
      color: string;
      gray: string;
    };
    border1: {
      color: string;
      gray: string;
    };
    border2: {
      color: string;
      gray: string;
    };
    border3: {
      color: string;
      gray: string;
    };
    button1: {
      color: string;
      gray: string;
    };
    button2: {
      color: string;
      gray: string;
    };
    text1: {
      color: string;
      gray: string;
    };
    text2: {
      color: string;
      gray: string;
    };
  };
  tendrel_constants: {
    yellow: string;
    purple: string;
    green: string;
    red: string;
    cream: string; //getthemoneydolladollabillsyall
  };
};

export type ColorThemeName = "light" | "dark";
