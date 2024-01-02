import "dotenv/config.js";

import { makeSendNewsletterHandler } from "../../../src/workers/factories/handlers/newsletter.js";

const command = makeSendNewsletterHandler();

try {
  await command.handler({
    data: {
      id: 2,
    },
  });

  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}
