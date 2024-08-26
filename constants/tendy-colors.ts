const colors: Record<ColorThemeName, ThemeColors> = {
  light: {
    tendrel_constants: {
      cream: "#f3eae0",
      yellow: "#fdb455",
      green: "#87a19a",
      red: "#c13752",
      purple: "#2a283e",
    },
    feedback: {
      error: { border: "#B12645", background: "#B12645" },
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
    //same as light until i figure out light and dark variants
    tendrel_constants: {
      cream: "#f3eae0",
      yellow: "#fdb455",
      green: "#87a19a",
      red: "#c13752",
      purple: "#2a283e",
    },
    feedback: { error: { border: "#B12645", background: "#B12645" } },
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
  tendrel: {
    //the darkest or lightest element, this would be for navigation components, root views, etc. Pair with text1 for the most contrast
    background1: {
      color: string;
      gray: string;
    };
    //Can be used for things that are the background, but not the root. ie something like card--its a background but you stil want to separate from the container background
    background2: {
      color: string;
      gray: string;
    };
    //Can be used for things like dialogs, or something that is interactive but not necessarily a button
    interactive1: {
      color: string;
      gray: string;
    };
    //light mode - darker than the last
    //dark mode - lighter than the last
    interactive2: {
      color: string;
      gray: string;
    };
    //light mode - darker than the last
    //dark mode - lighter than the last
    interactive3: {
      color: string;
      gray: string;
    };
    //you got this one I think
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
    //button background
    button1: {
      color: string;
      gray: string;
    };
    button2: {
      color: string;
      gray: string;
    };
    //text with a little bit of color
    text1: {
      color: string;
      gray: string;
    };
    //high contrast text
    text2: {
      color: string;
      gray: string;
    };
  };
  //OG tendy color scheme
  tendrel_constants: {
    yellow: string;
    purple: string;
    green: string;
    red: string;
    cream: string; //getthemoneydolladollabillsyall
  };
  //For things like overdue, success, error, etc. WIP
  feedback: {
    error: { background: string; border: string };
  };
};

export type ColorThemeName = "light" | "dark";
