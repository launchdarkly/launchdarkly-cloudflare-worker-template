import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { init } from "launchdarkly-cloudflare-edge-sdk";

let ldClient;

const initLdClient = () => {
  if (!ldClient) {
    // LD_KV and LD_CLIENT_SIDE_ID are runtime variables that the Workers runtime provides to your code.
    // For more information read https://developers.cloudflare.com/workers/platform/environment-variables
    ldClient = init(LD_KV, LD_CLIENT_SIDE_ID);
    return ldClient.waitForInitialization();
  }

  return Promise.resolve();
};

class FlagsStateInjector {
  async element(element) {
    const user = { key: "anonymous", custom: { teamId: "anonymous" } };
    const allFlags = await ldClient.allFlagsState(user, {
      clientSideOnly: true,
    });
    element.append(
      `<script>window.ldFlags = ${JSON.stringify(allFlags)}</script>`,
      { html: true }
    );
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const [response] = await Promise.all([getAssetFromKV(event), initLdClient()]);
  const acceptHeader = event.request.headers.get("accept");

  if (acceptHeader && acceptHeader.includes("text/html")) {
    return new HTMLRewriter()
      .on("head", new FlagsStateInjector())
      .transform(response);
  }

  return response;
}
