import { TendrelClient, TendrelStage } from "@tendrel/sdk";
import { z } from "zod";

const { STAGE } = z
  .object({
    STAGE: TendrelStage.default("dev"),
  })
  .parse(process.env);

// TODO: fill out with real credentials
const tendrel = new TendrelClient({
  credentials: {
    type: "sessionToken",
    udid: "tendrel-console",
    sessionToken: "",
  },
  stage: STAGE,
});

export const initialize = () => {
  return Promise.resolve(tendrel);
};
