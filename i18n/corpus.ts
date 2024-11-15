import type { NestedTranslation } from "../scripts/translate";

export const corpus: NestedTranslation = {
  pagination: {
    "showing-n-of": "Showing {{n}} of {{totalCount}}",
  },
  signIn: {
    username: "Username",
    password: "Password",
    or: "or",
    email: "Email",
  },
  checklist: {
    open: "Open",
    completed: "Completed",
    all: "All",
    assignedToMe: "Assigned to me",
    onDemand: "On Demand",
    dueToday: "Due Today",
  },
  currentUser: {
    switchCustomer: "Switch Customer",
    switchSite: "Switch Site",
    logout: "Logout",
    selectCustomer: "Select a Customer",
    selectSite: "Select a Site",
    selectAnOrganization: "Select an Organization",
  },
  settingsPage: {
    darkMode: "Dark mode",
    signOut: "Sign out",
  },
  tabBar: {
    checklists: "Checklists",
    Settings: "Settings",
  },
  screenNames: {
    checklists: "Checklists",
    work: "Work",
  },
  workScreen: {
    start: "Start",
    finish: "Finish",
    description: "Description",
    notStarted: "not started",
    preview: "Preview",
    submit: "Submit",
    cancelAndDiscard: "Cancel and Discard Data",
    saveAndFinish: "Save and Finish Later",
    numberOfCompleted: "{{dividend}} of {{divisor}} completed",
    seeMore: "See more",
    seeLess: "See less",
  },
  editChecklist: {
    selectWorker: "Select a Worker",
    unassign: "Unassign",
    assignee: "Assignee",
    editChecklist: "Edit Checklist",
    searchForWorker: "Search for a Worker",
    noWorkers: "No workers",
  },
};
