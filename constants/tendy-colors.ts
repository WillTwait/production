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
      error: {
        background1: "#fffcfc",
        background2: "#fff7f7",
        interactive1: "#feebec",
        interactive2: "#ffdbdc",
        interactive3: "#ffcdce",
        border1: "#fdbdbe",
        border2: "#f4a9aa",
        border3: "#eb8e90",
        button1: "#e5484d",
        button2: "#dc3e42",
        text1: "#ce2c31",
        text2: "#641723",
      },
      success: {
        background1: "#fbfefc",
        background2: "#f4fbf6",
        interactive1: "#e6f6eb",
        interactive2: "#d6f1df",
        interactive3: "#c4e8d1",
        border1: "#adddc0",
        border2: "#8eceaa",
        border3: "#5bb98b",
        button1: "#30a46c",
        button2: "#2b9a66",
        text1: "#218358",
        text2: "#193b2d",
      },
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
    feedback: {
      error: {
        background1: "#191111",
        background2: "#201314",
        interactive1: "#3b1219",
        interactive2: "#500f1c",
        interactive3: "#611623",
        border1: "#72232d",
        border2: "#8c333a",
        border3: "#b54548",
        button1: "#e5484d",
        button2: "#ec5d5e",
        text1: "#ff9592",
        text2: "#ffd1d9",
      },
      success: {
        background1: "#0e1512",
        background2: "#121b17",
        interactive1: "#132d21",
        interactive2: "#113b29",
        interactive3: "#174933",
        border1: "#20573e",
        border2: "#28684a",
        border3: "#2f7c57",
        button1: "#30a46c",
        button2: "#33b074",
        text1: "#3dd68c",
        text2: "#b1f1cb",
      },
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
    error: {
      background1: string;
      background2: string;
      interactive1: string;
      interactive2: string;
      interactive3: string;
      border1: string;
      border2: string;
      border3: string;
      button1: string;
      button2: string;
      text1: string;
      text2: string;
    };
    success: {
      background1: string;
      background2: string;
      interactive1: string;
      interactive2: string;
      interactive3: string;
      border1: string;
      border2: string;
      border3: string;
      button1: string;
      button2: string;
      text1: string;
      text2: string;
    };
  };
};

export type ColorThemeName = "light" | "dark";
