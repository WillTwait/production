import type { EditChecklistModalQuery } from "@/__generated__/EditChecklistModalQuery.graphql";
import type { EditChecklistModal_fragment$key } from "@/__generated__/EditChecklistModal_fragment.graphql";
import {
  type SheetDefinition,
  registerSheet,
} from "react-native-actions-sheet";
import type { PreloadedQuery } from "react-relay";
import { EditChecklistModal } from "./EditChecklistModal";

registerSheet("edit-checklist-sheet", EditChecklistModal);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "edit-checklist-sheet": SheetDefinition<{
      payload: {
        assignable: PreloadedQuery<EditChecklistModalQuery>;
        checklistId: string;
        cx: EditChecklistModal_fragment$key;
        onClose: () => void;
      };
    }>;
  }
}

// export {};
