---
title: SumUp Agent Toolkit
date: 2025-04-11
---

Every second Friday at some is a Hackday - a day to spend on learning, side-projects, and hacking. For me this usually meant working on our SDKs and developer portal. [SumUp Agent Toolkit](https://github.com/sumup/sumup-agent-toolkit/) is the latest addition, an SDK for agentic workflows build on top of our [Typescript SDK](https://github.com/sumup/sumup-ts). It supports [LangChain](https://www.langchain.com/), [AI SDK](https://sdk.vercel.ai/), and [OpenAI](https://github.com/openai/openai-node) as well as [Model Context Protocol](https://modelcontextprotocol.io/introduction) which is all the rage at the moment.

It was fun to build, the most complicated part was to figure out types for the shared module with tool definitions, where after some back and forth this seemed to do the trick:

```ts
import type SumUp from "@sumup/sdk";
import type { z } from "zod";

type ZodObjectAny = z.ZodObject<any, any, any, any>;

export type Tool<Args extends ZodObjectAny = ZodObjectAny> = {
  name: string;
  description: string;
  parameters: Args;
  callback: (sumup: SumUp, args: z.output<Args>) => Promise<string>;
};
```

I have then built a tiny CLI tool that takes our OpenAPI specs and generates parameter types and tools for every single publicly available endpoint. This part is extremely hacky (part of the reason why it isn't included in the repository so far) but saves a lot of manual work and makes keeping the implementation up to date easier.

It can automatically generate [zod](https://zod.dev/) types for all operations:

```ts
export const listMerchantMembersParameters = z.object({
  offset: z
    .number()
    .int()
    .describe(`Offset of the first member to return.`)
    .optional(),
  limit: z
    .number()
    .int()
    .describe(`Maximum number of members to return.`)
    .optional(),
  email: z
    .string()
    .describe(`Filter the returned members by email address prefix.`)
    .optional(),
  status: z
    .enum(["accepted", "pending", "expired", "disabled", "unknown"])
    .describe(`Filter the returned members by the membership status.`)
    .optional(),
  roles: z
    .array(z.string())
    .describe(`Filter the returned members by role.`)
    .optional(),
  merchant_code: z.string().describe(`Merchant code.`),
});
```

as well as tool definitions:

```ts
export const listMerchantMembers: Tool = {
  name: "list_merchant_members",
  description: `Lists merchant members.`,
  parameters: listMerchantMembersParameters,
  callback: async (
    sumup: SumUp,
    { merchant_code, ...args }: z.infer<typeof listMerchantMembersParameters>,
  ) => {
    const res = await sumup.members.list(merchant_code, args);
    return JSON.stringify(res);
  },
};
```

It's still cheaper, more secure, and more environmentally friendly to whip up a terminal and curl instead but at least it allowed us to test our Typescript SDK (and fix a few bugs). And given the current sentiment of the leadership, it might make it easier to sell the idea of a dedicated team for public APIs and developer experience.
