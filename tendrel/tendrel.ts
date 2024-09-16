import { TendrelClient, TendrelStage } from "@tendrel/sdk";
import { z } from "zod";

const { EXPO_PUBLIC_TENDREL_STAGE } = z
  .object({
    EXPO_PUBLIC_TENDREL_STAGE: TendrelStage.default("dev"),
  })
  .parse(process.env);

const tendrel = (token: string) => {
  return new TendrelClient({
    credentials: {
      type: "sessionToken",
      udid: "tendrel-console",
      sessionToken: token,
    },
    stage: EXPO_PUBLIC_TENDREL_STAGE,
  });
};

export const initialize = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();
  return Promise.resolve(tendrel(token ?? ""));
};
