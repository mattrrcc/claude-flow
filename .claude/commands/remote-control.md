# Remote Control

Start and manage the Claude Flow remote control HTTP server (ADR-078).

The remote control server exposes a token-authenticated HTTP API that lets external tools, CI/CD pipelines, and scripts send commands to a running Claude Flow session without being in the same terminal.

## Quick Start

```bash
# Start the server (background, port 3721 by default)
npx claude-flow@v3alpha remote-control start

# Check status
npx claude-flow@v3alpha remote-control status

# Send a command
npx claude-flow@v3alpha remote-control send --type swarm --action status

# Stop the server
npx claude-flow@v3alpha remote-control stop
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `start`    | Start the HTTP server (background by default) |
| `stop`     | Stop the server |
| `status`   | Show server status, uptime, and command count |
| `send`     | Send a command to the running server |
| `token`    | Print or rotate the auth token |

## start options

| Flag | Default | Description |
|------|---------|-------------|
| `--port, -p` | 3721 | Port to listen on |
| `--host, -H` | 127.0.0.1 | Host to bind |
| `--token` | auto-generated | Override the auth token |
| `--foreground, -f` | false | Block the terminal (don't detach) |

## send options

| Flag | Description |
|------|-------------|
| `--type, -t` | Command type: `task`, `session`, `agent`, `memory`, `swarm`, `raw` |
| `--action, -a` | Subcommand (e.g. `status`, `list`, `spawn`) |
| `--flags` | Extra CLI flags, comma-separated (e.g. `--name,foo,--type,coder`) |
| `--port, -p` | Server port (reads from state if omitted) |
| `--token` | Auth token (reads from state if omitted) |
| `--json` | Print raw JSON response |

## API Reference

The server exposes two endpoints:

### GET /status
Returns server health and statistics.

```bash
curl http://127.0.0.1:3721/status \
  -H "Authorization: Bearer <token>"
```

### POST /command
Execute a Claude Flow CLI subcommand.

```json
{
  "type": "swarm",
  "action": "status",
  "args": { "flags": ["--json"] },
  "requestId": "optional-correlation-id"
}
```

**Valid types:** `task`, `session`, `agent`, `memory`, `swarm`, `raw`

## Examples

```bash
# Start on custom port with explicit token
npx claude-flow@v3alpha remote-control start --port 4000 --token mysecrettoken

# List all agents
npx claude-flow@v3alpha remote-control send --type agent --action list

# Spawn a coder agent
npx claude-flow@v3alpha remote-control send \
  --type agent --action spawn \
  --flags "--type,coder,--name,my-coder"

# Search memory
npx claude-flow@v3alpha remote-control send \
  --type memory --action search \
  --flags "--query,authentication patterns"

# curl directly
TOKEN=$(npx claude-flow@v3alpha remote-control token)
curl -X POST http://127.0.0.1:3721/command \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"swarm","action":"status"}'

# Rotate the auth token
npx claude-flow@v3alpha remote-control token --rotate
```

## Security

- The server binds to `127.0.0.1` by default — only reachable from the local machine.
- All requests require a `Bearer` token validated with `crypto.timingSafeEqual`.
- Action inputs are validated against `[\w\-]+` to prevent injection.
- State (including token) is stored in `.claude-flow/remote-control.json`.

## Instructions for Claude

When this skill is invoked, execute the following steps:

1. Check the current remote-control status:
   ```bash
   npx claude-flow@v3alpha remote-control status
   ```

2. If the server is not running, start it:
   ```bash
   npx claude-flow@v3alpha remote-control start
   ```

3. Show the user the server endpoint and token:
   ```bash
   npx claude-flow@v3alpha remote-control status
   ```

4. Print the auth token for the user:
   ```bash
   npx claude-flow@v3alpha remote-control token
   ```

5. Demonstrate a sample command to verify the server is working:
   ```bash
   npx claude-flow@v3alpha remote-control send --type swarm --action status
   ```

6. Report what the server is listening on and how to connect from external tools.
