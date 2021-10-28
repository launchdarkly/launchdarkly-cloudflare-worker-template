const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')
const { init } = require('launchdarkly-cloudflare-edge-sdk')

let ldClient

const initLdClient = () => {
  if (ldClient) {
    return Promise.resolve()
  }

  ldClient = init(MY_KV, 'YOUR_CLIENT_SIDE_ID')
  return ldClient.waitForInitialization()
}

class FlagsStateInjector {
  async element(element) {
    const user = { key: 'anonymous', custom: { teamId: 'anonymous' } }
    const allFlags = await ldClient.allFlagsState(user, { clientSideOnly: true })
    element.append(`<script>window.ldFlags = ${JSON.stringify(allFlags)}</script>`, { html: true })
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const [response] = await Promise.all([getAssetFromKV(event), initLdClient()])
  const acceptHeader = event.request.headers.get('accept')

  if(acceptHeader && acceptHeader.includes('text/html')){
    return new HTMLRewriter().on('head', new FlagsStateInjector()).transform(response)
  }

  return response
}
