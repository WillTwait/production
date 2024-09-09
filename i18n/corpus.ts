import type { NestedTranslation } from "../scripts/translate";

export const corpus: NestedTranslation = {
  signIn: {
    username: "username",
    password: "password",
    or: "or",
    email: "email",
  },
  checklist: {
    open: "open",
    completed: "completed",
    all: "all",
    assignedToMe: "assigned to me",
    onDemand: "on demand",
    dueToday: "due today",
  },
  currentUser: {
    switchCustomer: "switch customer",
    switchSite: "switch site",
    logout: "logout",
    selectCustomer: "select a customer",
    selectSite: "select a site",
    selectAnOrganization: "select an organization",
  },
  settingsPage: {
    darkMode: "dark mode",
    signOut: "sign out",
  },
  tabBar: {
    checklists: "checklists",
    Settings: "settings",
  },
  screenNames: {
    checklists: "checklists",
    work: "work",
  },
  workScreen: {
    start: "start",
    finish: "finish",
    description: "description",
    notStarted: "not started",
    submit: "submit",
    cancelAndDiscard: "cancel and discard data",
    saveAndFinish: "save and finish later",
    numberOfCompleted: "{{dividend}} of {{divisor}} completed",
    seeMore: "See more",
    seeLess: "See less",
  },
};
