# n8n-nodes-whapi

This is an n8n community node. It lets you use Whapi service in your n8n workflows.

[Whapi.Cloud](https://whapi.cloud/) provides an API gateway that seamlessly integrates WhatsApp with your website, app, or CRM. It supports sending messages to groups, channels, statuses and communities without restrictions.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

Typical setups with this package:

1. A customer writes on WhatsApp, **Whapi Trigger** starts an n8n workflow, and the workflow updates a CRM or ticket system.
2. A customer writes on WhatsApp, the trigger starts a workflow, and the workflow calls an AI step and replies with **Whapi → Message → Send**.
3. An event in your CRM or database starts a workflow, and the workflow sends a WhatsApp message (text or media) through **Whapi**.

[Installation](#installation)  
[Compatibility](#compatibility)  
[Operations](#operations)  
[Credentials](#credentials)  
[Examples](#examples)  
[Development](#development)  
[Resources](#resources)  

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In n8n, go to **Settings → Community nodes**, click **Install**, and enter:

```text
n8n-nodes-whapi
```

On self-hosted n8n you can also install the package with npm or pnpm inside the n8n environment, or add it via your deployment’s community-node mechanism. Restart n8n after installing so the **Whapi** and **Whapi Trigger** nodes appear in the editor.

---

## Compatibility

- Minimum n8n version: **1.0.0** (community nodes)
- Node.js: **>=18.10**
- Package manager for development: **pnpm >=9.1** (see [Development](#development))

---

## Operations

This package includes basic operations:

- Send text and media message  
- Get message by ID  
- Check phone number  

And events:

- All messages events (new message, message deletion …)  
- All groups events (new group, new group participant …)  

### Whapi node

Action node for your Whapi channel API (`https://gate.whapi.cloud`).

| Resource | Operation | Description |
|----------|-----------|-------------|
| Message | Send | Send text, image, video, audio, document, or contact to a phone number or chat ID |
| Message | Get | Retrieve a message by ID |
| Contact | Check | Check whether a phone number is registered on WhatsApp |

#### Message → Send

| Parameter | Description |
|-----------|-------------|
| **Recipient** | Phone number (e.g. `447911123456`) or group/channel **Chat ID**. Chat IDs from a webhook payload can be reused in expressions (e.g. `{{ $json.chat_id }}` — field names depend on the Whapi webhook body). |
| **Message Type** | `text`, `image`, `video`, `audio`, `document`, `contact` |
| **Typing Time** | Seconds to simulate typing before send (0–60) |
| **Body** | Text for `text` and `contact` types |
| **Media String** | URL, media ID, or base64 for media types |
| **Caption** | Caption for image, video, document, contact |

Use expressions from earlier nodes for **Recipient**, **Body**, and media fields. The API response is returned as the output item.

#### Message → Get

| Parameter | Description |
|-----------|-------------|
| **Message ID** | ID of the message to fetch |

#### Contact → Check

| Parameter | Description |
|-----------|-------------|
| **Contact** | Phone number to check (e.g. `447911123456`) |

---

### Whapi Trigger node

Starts a workflow when Whapi sends a webhook to n8n.

| Option | Description |
|--------|-------------|
| **Messages Events** | Message-related webhooks (create, update, delete, etc., as configured on the channel) |
| **Groups Events** | Group-related webhooks |

**Activation:** When you activate the workflow, the node registers n8n’s webhook URL on your Whapi channel settings (existing webhooks on the channel are kept; this trigger’s URL is added or updated for the selected event types). When you deactivate the workflow, only this trigger’s URL is removed from the channel.

**Payload:** Each request that matches the selected events becomes one item. The item body is the JSON Whapi posted to the webhook. Exact fields are defined in the [Whapi API Incoming webhooks format docs](https://support.whapi.cloud/help-desk/receiving/webhooks/incoming-webhooks-format); map them in expressions from `$json`.

You can copy the production webhook URL from the trigger’s webhook panel in n8n if you need to register it manually in the [Whapi Panel](https://panel.whapi.cloud/).

---

## Credentials

For using Whapi Api you need to provide channel token. You can find it on your channel page https://panel.whapi.cloud/channels/{channel-id}

Create a credential named **Whapi API** in n8n:

| Field | What to paste |
|-------|----------------|
| **Access Token** | Channel token from the channel page in [Whapi Panel](https://panel.whapi.cloud/) |
| **Channel ID** | Optional. Channel ID from the URL `panel.whapi.cloud/channels/{channel-id}` |

Steps:

1. Log in to [Whapi Panel](https://panel.whapi.cloud/) and open your channel.
2. Copy the **Token** from channel settings.
3. In n8n: **Credentials → New → Whapi API**, paste the token.
4. Optionally fill **Channel ID**.
5. Click **Test** — a successful test calls `GET https://gate.whapi.cloud/limits`.

The same credential is used by **Whapi** and **Whapi Trigger**. The token stays in the credential store; you select the credential on each node instead of pasting the token again. If you change the credential, nodes keep using whichever credential is selected on them.

The credential type also supports generic authentication (Bearer header) for the n8n **HTTP Request** node when you call other Whapi endpoints manually.

---

## Examples

**Auto-reply to an incoming message**

1. **Whapi Trigger** — enable **Messages Events**.
2. **Whapi → Message → Send** — set **Recipient** from the trigger payload and **Body** to your reply text.

**Forward incoming data to a CRM**

1. **Whapi Trigger**.
2. **HTTP Request** (or CRM node) — post relevant fields from `{{ $json }}` to your system.

**Outbound notification from another system**

1. Your schedule, webhook, or CRM trigger.
2. **Whapi → Message → Send** — map phone or chat ID and message text or media from the incoming item.

---

## Development

Repository: [github.com/Whapi-Cloud/n8n-nodes-whapi](https://github.com/Whapi-Cloud/n8n-nodes-whapi)  
npm package: [n8n-nodes-whapi](https://www.npmjs.com/package/n8n-nodes-whapi)

```bash
pnpm install
pnpm build
pnpm lint
```

- `pnpm build` — compile TypeScript to `dist/` and copy icons (required before local linking or publish).
- `pnpm dev` — watch TypeScript rebuild.

To try the node in a local n8n instance, link or install the built package into your n8n custom extensions path according to the [community nodes development docs](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/).

Publishing to npm is done via GitHub Actions when a version tag `v*` is pushed (see `.github/workflows/publish.yml` when present in the repo).

---

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Whapi API documentation](https://whapi.cloud/docs)
* [Whapi Panel](https://panel.whapi.cloud/)

---

## License

[MIT](LICENSE.md)
