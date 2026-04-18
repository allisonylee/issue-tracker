#!/usr/bin/env npx tsx
import { faker } from "@faker-js/faker";
import { spawnSync } from "node:child_process";

const PROJECT_COUNT = 50;
const MAX_ISSUES_PER_PROJECT = 10;

const statuses = ["todo", "in-progress", "done"] as const;

const projects = Array.from({ length: PROJECT_COUNT }, () => {
  const issueCount = faker.number.int({ min: 3, max: MAX_ISSUES_PER_PROJECT });

  return {
    name: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    issues: Array.from({ length: issueCount }, () => ({
      title: faker.hacker.phrase(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(statuses),
    })),
  };
});

console.log(`Seeding ${projects.length} projects...`);

const result = spawnSync(
  "npx",
  ["convex", "run", "seed:insertSeedData", JSON.stringify({ projects })],
  {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  },
);

if (result.status !== 0) {
  console.error("Seed failed:");
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

console.log("Done!");
