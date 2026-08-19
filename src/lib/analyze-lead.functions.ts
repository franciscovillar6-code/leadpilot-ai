import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AnalyzedInquiry, InquiryInput } from "./analyze-lead.server";

export type { AnalyzedInquiry, InquiryInput };

export const analyzeInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(120),
        email: z.string().trim().max(255).optional().default(""),
        phone: z.string().trim().max(60).optional().default(""),
        message: z.string().trim().min(10).max(4000),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<AnalyzedInquiry> => {
    const { runInquiryAnalysis } = await import("./analyze-lead.server");
    return runInquiryAnalysis(data);
  });
