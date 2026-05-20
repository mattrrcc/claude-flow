/**
 * V3 CLI Remote Control Command
 * HTTP API server for external orchestration of Claude Flow sessions.
 *
 * ADR-078: Remote Control Interface
 *
 * Provides: start, stop, status, send, listen subcommands.
 * State persisted to .claude-flow/remote-control.json.
 */

import type { Command, CommandContext, CommandResult } from '../types.js';
import { output } from '../output.js';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as crypto from 'crypto';

// ── Types ──────────────────────────────────────────────────────

interface RCState {
  enabled: boolean;
  port: number;
  host: string;
  token: string;
  pid?: number;
  startedAt?: string;
  lastCommand?: string;
  lastCommandAt?: string;
  commandsReceived: number;
}

interface RCCommand {
  type: 'task' | 'session' | 'agent' | 'memory' | 'swarm' | 'raw';
  action: string;
  args?: Record<string, unknown>;
  requestId?: string;
}

interface RCResponse {
  ok: boolean;
  requestId?: string;
  result?: unknown;
  error?: string;
}

// ── Constants ──────────────────────────────────────────────────

const STATE_DIR_NAME = '.claude-flow';
const STATE_FILE_NAME = 'remote-control.json';
const DEFAULT_PORT = 3721;
const DEFAULT_HOST = '127.0.0.1';

// ── State helpers ──────────────────────────────────────────────

function stateDir(projectRoot: string): string {
  return path.join(projectRoot, STATE_DIR_NAME);
}

function statePath(projectRoot: string): string {
  return path.join(stateDir(projectRoot), STATE_FILE_NAME);
}

function loadState(projectRoot: string): RCState {
  const file = statePath(projectRoot);
  if (!fs.existsSync(file)) {
    return {
      enabled: false,
      port: DEFAULT_PORT,
      host: DEFAULT_HOST,
      token: crypto.randomBytes(24).toString('hex'),
      commandsReceived: 0,
    };
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as RCState;
  } catch {
    return {
      enabled: false,
      port: DEFAULT_PORT,
      host: DEFAULT_HOST,
      token: crypto.randomBytes(24).toString('hex'),
      commandsReceived: 0,
    };
  }
}

function saveState(projectRoot: string, state: RCState): void {
  const dir = stateDir(projectRoot);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(statePath(projectRoot), JSON.stringify(state, null, 2), 'utf8');
}

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// ── Token validation (constant-time) ──────────────────────────

function validateToken(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

// ── Command executor ───────────────────────────────────────────

async function executeRemoteCommand(cmd: RCCommand): Promise<unknown> {
  const { execFile } = await import('child_process');
  const { promisify } = await import('util');
  const execFileAsync = promisify(execFile);

  const cli = process.argv[1] ?? 'claude-flow';

  const buildArgs = (parts: string[]): string[] => parts.filter(Boolean);

  switch (cmd.type) {
    case 'session': {
      const args = buildArgs(['session', cmd.action, ...(cmd.args?.flags as string[] ?? [])]);
      const { stdout } = await execFileAsync(process.execPath, [cli, ...args], { timeout: 30_000 });
      return { output: stdout.trim() };
    }
    case 'agent': {
      const args = buildArgs(['agent', cmd.action, ...(cmd.args?.flags as string[] ?? [])]);
      const { stdout } = await execFileAsync(process.execPath, [cli, ...args], { timeout: 30_000 });
      return { output: stdout.trim() };
    }
    case 'memory': {
      const args = buildArgs(['memory', cmd.action, ...(cmd.args?.flags as string[] ?? [])]);
      const { stdout } = await execFileAsync(process.execPath, [cli, ...args], { timeout: 15_000 });
      return { output: stdout.trim() };
    }
    case 'swarm': {
      const args = buildArgs(['swarm', cmd.action, ...(cmd.args?.flags as string[] ?? [])]);
      const { stdout } = await execFileAsync(process.execPath, [cli, ...args], { timeout: 30_000 });
      return { output: stdout.trim() };
    }
    case 'task': {
      const args = buildArgs(['task', cmd.action, ...(cmd.args?.flags as string[] ?? [])]);
      const { stdout } = await execFileAsync(process.execPath, [cli, ...args], { timeout: 60_000 });
      return { output: stdout.trim() };
    }
    case 'raw': {
      // raw: cmd.action is the full subcommand, args.flags are additional flags
      const allArgs = [cmd.action, ...(cmd.args?.flags as string[] ?? [])];
      const { stdout } = await execFileAsync(process.execPath, [cli, ...allArgs], { timeout: 60_000 });
      return { output: stdout.trim() };
    }
    default:
      throw new Error(`Unknown command type: ${(cmd as RCCommand).type}`);
  }
}

// ── HTTP Server ────────────────────────────────────────────────

function createServer(state: RCState, projectRoot: string): http.Server {
  const server = http.createServer(async (req, res) => {
    // CORS headers for local tooling
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Auth
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token || !validateToken(token, state.token)) {
      res.writeHead(401);
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
      return;
    }

    // Routes
    if (req.method === 'GET' && req.url === '/status') {
      const current = loadState(projectRoot);
      res.writeHead(200);
      res.end(JSON.stringify({
        ok: true,
        result: {
          enabled: current.enabled,
          commandsReceived: current.commandsReceived,
          lastCommand: current.lastCommand,
          lastCommandAt: current.lastCommandAt,
          uptime: current.startedAt ? Date.now() - new Date(current.startedAt).getTime() : 0,
          host: `${current.host}:${current.port}`,
        },
      }));
      return;
    }

    if (req.method === 'POST' && req.url === '/command') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        let cmd: RCCommand;
        try {
          cmd = JSON.parse(body) as RCCommand;
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
          return;
        }

        // Input validation
        const validTypes = ['task', 'session', 'agent', 'memory', 'swarm', 'raw'];
        if (!cmd.type || !validTypes.includes(cmd.type)) {
          res.writeHead(400);
          res.end(JSON.stringify({ ok: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }));
          return;
        }
        if (!cmd.action || typeof cmd.action !== 'string') {
          res.writeHead(400);
          res.end(JSON.stringify({ ok: false, error: 'action is required' }));
          return;
        }
        // Prevent shell injection: only allow alphanumeric, dashes, underscores
        if (!/^[\w\-]+$/.test(cmd.action)) {
          res.writeHead(400);
          res.end(JSON.stringify({ ok: false, error: 'action contains invalid characters' }));
          return;
        }

        const response: RCResponse = { ok: false, requestId: cmd.requestId };
        try {
          response.result = await executeRemoteCommand(cmd);
          response.ok = true;
        } catch (err) {
          response.error = err instanceof Error ? err.message : String(err);
        }

        // Update state
        const current = loadState(projectRoot);
        current.commandsReceived = (current.commandsReceived ?? 0) + 1;
        current.lastCommand = `${cmd.type}:${cmd.action}`;
        current.lastCommandAt = new Date().toISOString();
        saveState(projectRoot, current);

        res.writeHead(response.ok ? 200 : 500);
        res.end(JSON.stringify(response));
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ ok: false, error: 'Not found' }));
  });

  return server;
}

// ── Subcommands ────────────────────────────────────────────────

const startSubcommand: Command = {
  name: 'start',
  description: 'Start the remote control HTTP server',
  options: [
    { name: 'port', short: 'p', type: 'string', description: `Port to listen on (default: ${DEFAULT_PORT})` },
    { name: 'host', short: 'H', type: 'string', description: `Host to bind (default: ${DEFAULT_HOST})` },
    { name: 'token', type: 'string', description: 'Auth token (auto-generated if omitted)' },
    { name: 'foreground', short: 'f', type: 'boolean', description: 'Run in foreground (blocks terminal)' },
    { name: 'quiet', short: 'q', type: 'boolean', description: 'Suppress output' },
  ],
  examples: [
    { command: 'claude-flow remote-control start', description: 'Start with defaults on port 3721' },
    { command: 'claude-flow remote-control start --port 4000', description: 'Start on custom port' },
    { command: 'claude-flow remote-control start --foreground', description: 'Run in foreground' },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const projectRoot = process.cwd();
    const quiet = ctx.flags.quiet as boolean | undefined;

    const state = loadState(projectRoot);

    // Check if already running
    if (state.enabled && state.pid && isProcessRunning(state.pid)) {
      if (!quiet) output.printWarning(`Remote control already running (PID: ${state.pid}, port: ${state.port})`);
      return { success: true };
    }

    const rawPort = ctx.flags.port as string | undefined;
    const rawHost = ctx.flags.host as string | undefined;
    const foreground = ctx.flags.foreground as boolean | undefined;

    // Validate port
    if (rawPort !== undefined) {
      const p = parseInt(rawPort, 10);
      if (isNaN(p) || p < 1024 || p > 65535) {
        output.printError('Invalid port. Must be between 1024 and 65535.');
        return { success: false, exitCode: 1 };
      }
      state.port = p;
    }

    // Validate host
    if (rawHost !== undefined) {
      if (!/^[\w\.\-]+$/.test(rawHost)) {
        output.printError('Invalid host value.');
        return { success: false, exitCode: 1 };
      }
      state.host = rawHost;
    }

    // Override token if provided
    if (ctx.flags.token) {
      const rawToken = ctx.flags.token as string;
      if (rawToken.length < 16 || !/^[a-zA-Z0-9\-_]+$/.test(rawToken)) {
        output.printError('Token must be at least 16 alphanumeric characters.');
        return { success: false, exitCode: 1 };
      }
      state.token = rawToken;
    }

    if (foreground) {
      // Foreground: run server in this process
      return runServerForeground(state, projectRoot, quiet ?? false);
    }

    // Background: spawn a detached child process
    const { spawn } = await import('child_process');
    const args = [
      process.argv[1],
      'remote-control', 'start',
      '--foreground',
      '--quiet',
      '--port', String(state.port),
      '--host', state.host,
      '--token', state.token,
    ];

    const child = spawn(process.execPath, args, {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, CLAUDE_FLOW_RC_SERVER: '1' },
    });
    child.unref();

    // Give child a moment to bind
    await new Promise(r => setTimeout(r, 500));

    state.enabled = true;
    state.pid = child.pid;
    state.startedAt = new Date().toISOString();
    saveState(projectRoot, state);

    if (!quiet) {
      output.writeln('');
      output.writeln(output.bold('Remote Control Server Started'));
      output.writeln(output.dim('─'.repeat(50)));
      output.writeln(`  ${output.info('Endpoint')}  http://${state.host}:${state.port}`);
      output.writeln(`  ${output.info('Token')}     ${state.token}`);
      output.writeln(`  ${output.info('PID')}       ${child.pid}`);
      output.writeln('');
      output.writeln(output.dim('Send a command:'));
      output.writeln(output.dim(`  curl -X POST http://${state.host}:${state.port}/command \\`));
      output.writeln(output.dim(`    -H "Authorization: Bearer ${state.token}" \\`));
      output.writeln(output.dim(`    -H "Content-Type: application/json" \\`));
      output.writeln(output.dim(`    -d '{"type":"swarm","action":"status"}'`));
      output.writeln('');
    }

    return { success: true };
  },
};

async function runServerForeground(state: RCState, projectRoot: string, quiet: boolean): Promise<CommandResult> {
  return new Promise((resolve) => {
    const server = createServer(state, projectRoot);

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        output.printError(`Port ${state.port} is already in use.`);
      } else {
        output.printError(`Server error: ${err.message}`);
      }
      resolve({ success: false, exitCode: 1 });
    });

    server.listen(state.port, state.host, () => {
      state.enabled = true;
      state.pid = process.pid;
      state.startedAt = new Date().toISOString();
      saveState(projectRoot, state);

      if (!quiet) {
        output.writeln(`Remote control server listening on http://${state.host}:${state.port}`);
      }

      // Keep running until signal
      const cleanup = () => {
        state.enabled = false;
        saveState(projectRoot, state);
        server.close(() => resolve({ success: true }));
      };
      process.once('SIGINT', cleanup);
      process.once('SIGTERM', cleanup);
    });
  });
}

const stopSubcommand: Command = {
  name: 'stop',
  description: 'Stop the remote control server',
  options: [
    { name: 'quiet', short: 'q', type: 'boolean', description: 'Suppress output' },
  ],
  examples: [
    { command: 'claude-flow remote-control stop', description: 'Stop the server' },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const projectRoot = process.cwd();
    const quiet = ctx.flags.quiet as boolean | undefined;
    const state = loadState(projectRoot);

    if (!state.enabled || !state.pid) {
      if (!quiet) output.printWarning('Remote control server is not running.');
      return { success: true };
    }

    if (isProcessRunning(state.pid)) {
      try {
        process.kill(state.pid, 'SIGTERM');
        if (!quiet) output.printSuccess(`Sent SIGTERM to PID ${state.pid}`);
      } catch {
        if (!quiet) output.printWarning(`Could not signal PID ${state.pid} — may have already exited.`);
      }
    }

    state.enabled = false;
    state.pid = undefined;
    saveState(projectRoot, state);

    if (!quiet) output.printSuccess('Remote control server stopped.');
    return { success: true };
  },
};

const statusSubcommand: Command = {
  name: 'status',
  description: 'Show remote control server status',
  options: [
    { name: 'json', type: 'boolean', description: 'Output as JSON' },
  ],
  examples: [
    { command: 'claude-flow remote-control status', description: 'Show status' },
    { command: 'claude-flow remote-control status --json', description: 'JSON output' },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const projectRoot = process.cwd();
    const state = loadState(projectRoot);
    const running = state.enabled && !!state.pid && isProcessRunning(state.pid!);

    if (ctx.flags.json) {
      output.writeln(JSON.stringify({ ...state, running }, null, 2));
      return { success: true };
    }

    output.writeln('');
    output.writeln(output.bold('Remote Control Status'));
    output.writeln(output.dim('─'.repeat(50)));
    output.writeln(`  Status:    ${running ? output.success('running') : output.dim('stopped')}`);
    output.writeln(`  Endpoint:  http://${state.host}:${state.port}`);
    if (running) {
      output.writeln(`  PID:       ${state.pid}`);
      output.writeln(`  Started:   ${state.startedAt ?? 'unknown'}`);
      output.writeln(`  Commands:  ${state.commandsReceived ?? 0} received`);
      if (state.lastCommand) {
        output.writeln(`  Last cmd:  ${state.lastCommand} at ${state.lastCommandAt}`);
      }
    }
    output.writeln('');

    return { success: true };
  },
};

const sendSubcommand: Command = {
  name: 'send',
  description: 'Send a command to the running remote control server',
  options: [
    { name: 'type', short: 't', type: 'string', description: 'Command type (task|session|agent|memory|swarm|raw)', required: true },
    { name: 'action', short: 'a', type: 'string', description: 'Subcommand action (e.g. "status", "spawn", "list")', required: true },
    { name: 'flags', type: 'string', description: 'Extra flags passed to the CLI (comma-separated, e.g. "--name foo,--type coder")' },
    { name: 'port', short: 'p', type: 'string', description: `Server port (default: ${DEFAULT_PORT})` },
    { name: 'host', short: 'H', type: 'string', description: `Server host (default: ${DEFAULT_HOST})` },
    { name: 'token', type: 'string', description: 'Auth token (reads from state file if omitted)' },
    { name: 'json', type: 'boolean', description: 'Print raw JSON response' },
  ],
  examples: [
    { command: 'claude-flow remote-control send --type swarm --action status', description: 'Query swarm status' },
    { command: 'claude-flow remote-control send --type agent --action list', description: 'List agents' },
    { command: 'claude-flow remote-control send --type memory --action list --flags "--namespace,patterns"', description: 'List memory entries' },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const projectRoot = process.cwd();
    const state = loadState(projectRoot);

    const rawType = ctx.flags.type as string;
    const rawAction = ctx.flags.action as string;

    if (!rawType || !rawAction) {
      output.printError('--type and --action are required.');
      return { success: false, exitCode: 1 };
    }

    const validTypes = ['task', 'session', 'agent', 'memory', 'swarm', 'raw'];
    if (!validTypes.includes(rawType)) {
      output.printError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      return { success: false, exitCode: 1 };
    }
    if (!/^[\w\-]+$/.test(rawAction)) {
      output.printError('Invalid action value.');
      return { success: false, exitCode: 1 };
    }

    const rawPort = ctx.flags.port as string | undefined;
    const rawHost = ctx.flags.host as string | undefined;
    const port = rawPort ? parseInt(rawPort, 10) : state.port;
    const host = rawHost ?? state.host;
    const token = (ctx.flags.token as string | undefined) ?? state.token;

    const rawFlags = ctx.flags.flags as string | undefined;
    const flagsArray = rawFlags ? rawFlags.split(',').map(s => s.trim()).filter(Boolean) : [];

    const cmd: RCCommand = {
      type: rawType as RCCommand['type'],
      action: rawAction,
      args: flagsArray.length ? { flags: flagsArray } : undefined,
      requestId: crypto.randomBytes(8).toString('hex'),
    };

    // Send HTTP request
    const body = JSON.stringify(cmd);
    const options: http.RequestOptions = {
      hostname: host,
      port,
      path: '/command',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`,
      },
    };

    return new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data) as RCResponse;
            if (ctx.flags.json) {
              output.writeln(JSON.stringify(parsed, null, 2));
            } else if (parsed.ok && parsed.result) {
              const result = parsed.result as { output?: string };
              output.writeln(result.output ?? JSON.stringify(parsed.result, null, 2));
            } else {
              output.printError(parsed.error ?? 'Unknown error from remote server');
            }
            resolve({ success: parsed.ok, exitCode: parsed.ok ? 0 : 1 });
          } catch {
            output.printError('Failed to parse server response');
            resolve({ success: false, exitCode: 1 });
          }
        });
      });
      req.on('error', (err) => {
        output.printError(`Could not connect to remote control server at ${host}:${port}: ${err.message}`);
        output.writeln(output.dim('Is the server running? Try: claude-flow remote-control start'));
        resolve({ success: false, exitCode: 1 });
      });
      req.setTimeout(15_000, () => {
        req.destroy();
        output.printError('Request timed out after 15s');
        resolve({ success: false, exitCode: 1 });
      });
      req.write(body);
      req.end();
    });
  },
};

const tokenSubcommand: Command = {
  name: 'token',
  description: 'Print or rotate the auth token for the remote control server',
  options: [
    { name: 'rotate', type: 'boolean', description: 'Generate a new token (requires server restart)' },
  ],
  examples: [
    { command: 'claude-flow remote-control token', description: 'Print current token' },
    { command: 'claude-flow remote-control token --rotate', description: 'Generate new token' },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const projectRoot = process.cwd();
    const state = loadState(projectRoot);

    if (ctx.flags.rotate) {
      state.token = crypto.randomBytes(24).toString('hex');
      saveState(projectRoot, state);
      output.printSuccess('Token rotated. Restart the server for it to take effect.');
    }

    output.writeln(state.token);
    return { success: true };
  },
};

// ── Root command ───────────────────────────────────────────────

export const remoteControlCommand: Command = {
  name: 'remote-control',
  aliases: ['rc'],
  description: 'HTTP API for remote orchestration of Claude Flow sessions',
  subcommands: [
    startSubcommand,
    stopSubcommand,
    statusSubcommand,
    sendSubcommand,
    tokenSubcommand,
  ],
  examples: [
    { command: 'claude-flow remote-control start', description: 'Start the remote control server' },
    { command: 'claude-flow remote-control status', description: 'Check server status' },
    { command: 'claude-flow remote-control send --type swarm --action status', description: 'Query swarm status remotely' },
    { command: 'claude-flow remote-control stop', description: 'Stop the server' },
  ],
  action: async (_ctx: CommandContext): Promise<CommandResult> => {
    output.writeln('');
    output.writeln(output.bold('Claude Flow Remote Control (ADR-078)'));
    output.writeln(output.dim('─'.repeat(50)));
    output.writeln('  Lightweight HTTP API for external orchestration of sessions.');
    output.writeln('');
    output.writeln(output.bold('Subcommands:'));
    output.writeln('  start   Start the remote control server');
    output.writeln('  stop    Stop the server');
    output.writeln('  status  Show server status and statistics');
    output.writeln('  send    Send a command to the running server');
    output.writeln('  token   Print or rotate the auth token');
    output.writeln('');
    output.writeln(output.bold('Quick Start:'));
    output.writeln('  claude-flow remote-control start');
    output.writeln('  claude-flow remote-control send --type swarm --action status');
    output.writeln('  claude-flow remote-control stop');
    output.writeln('');
    return { success: true };
  },
};

export default remoteControlCommand;
