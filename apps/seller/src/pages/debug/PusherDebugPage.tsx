import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { resolvePusherCluster, resolvePusherKey } from '../../config/resolvePusherConfig';
import { getToken } from '../../lib/authStorage';
import { API_BASE_URL } from '../../config/api';

interface LogEntry {
  time: string;
  message: string;
  level: 'info' | 'ok' | 'error';
}

function timestamp() {
  return new Date().toLocaleTimeString();
}

export default function PusherDebugPage() {
  const [key, setKey] = useState(resolvePusherKey);
  const [cluster, setCluster] = useState(resolvePusherCluster);
  const [apiBase, setApiBase] = useState(() =>
    API_BASE_URL.replace(/\/api\/?$/, ''),
  );
  const [token, setToken] = useState(() => getToken() ?? '');
  const [channel, setChannel] = useState('my-channel');
  const [event, setEvent] = useState('my-event');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);

  const pusherRef = useRef<Pusher | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  useEffect(() => {
    return () => {
      pusherRef.current?.disconnect();
    };
  }, []);

  function addLog(message: string, level: LogEntry['level'] = 'info') {
    setLog((prev) => [...prev, { time: timestamp(), message, level }]);
  }

  function connect() {
    if (pusherRef.current) {
      pusherRef.current.disconnect();
      pusherRef.current = null;
      setConnected(false);
    }

    const isPrivate =
      channel.startsWith('private-') || channel.startsWith('presence-');

    const options: ConstructorParameters<typeof Pusher>[1] = {
      cluster,
      forceTLS: true,
    };

    if (isPrivate) {
      options.authorizer = (ch) => ({
        authorize(socketId, callback) {
          if (!token) {
            addLog('No token — auth will fail for private channels.', 'error');
            callback(new Error('no token'), null);
            return;
          }
          fetch(`${apiBase.replace(/\/$/, '')}/broadcasting/auth`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ socket_id: socketId, channel_name: ch.name }),
          })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((d) => {
              addLog(`Auth OK for ${ch.name}`, 'ok');
              callback(null, d as { auth: string });
            })
            .catch((e) => {
              addLog(`Auth FAILED for ${ch.name}: ${e}`, 'error');
              callback(new Error('auth failed'), null);
            });
        },
      });
    }

    const p = new Pusher(key, options);
    pusherRef.current = p;

    p.connection.bind('connecting', () => addLog('Connecting…'));
    p.connection.bind('connected', () => {
      addLog(`Connected ✓  socket_id=${p.connection.socket_id}`, 'ok');
      setConnected(true);
      subscribe(p, channel, event);
    });
    p.connection.bind('error', (e: unknown) =>
      addLog(`Connection error: ${JSON.stringify(e)}`, 'error'),
    );
    p.connection.bind('failed', () =>
      addLog('Connection FAILED — check key/cluster', 'error'),
    );
    p.connection.bind('disconnected', () => {
      addLog('Disconnected');
      setConnected(false);
    });

    addLog(`Connecting  key=${key}  cluster=${cluster}…`);
  }

  function subscribe(p: Pusher, channelName: string, eventName: string) {
    const ch = p.subscribe(channelName);
    ch.bind('pusher:subscription_succeeded', () =>
      addLog(`Subscribed to ${channelName} ✓`, 'ok'),
    );
    ch.bind('pusher:subscription_error', (e: unknown) =>
      addLog(`Subscription error on ${channelName}: ${JSON.stringify(e)}`, 'error'),
    );
    ch.bind(eventName, (data: unknown) =>
      addLog(`[${eventName}] ${JSON.stringify(data)}`, 'ok'),
    );
    addLog(`Subscribing  channel=${channelName}  event=${eventName}`);
  }

  function disconnect() {
    pusherRef.current?.disconnect();
    pusherRef.current = null;
    setConnected(false);
    addLog('Disconnected manually');
  }

  const inputCls =
    'w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500';
  const labelCls = 'block text-xs text-white/50 mb-1';

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Pusher Debug</h1>
        <p className="mt-1 text-sm text-white/50">
          Live connection tester for Pusher channels. Fields are pre-filled from{' '}
          <code className="text-violet-400">config.js</code>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Pusher Key</label>
          <input className={inputCls} value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Cluster</label>
          <input className={inputCls} value={cluster} onChange={(e) => setCluster(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>API Base (for private-channel auth)</label>
          <input className={inputCls} value={apiBase} onChange={(e) => setApiBase(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Bearer Token (auto-filled from session)</label>
          <input
            className={inputCls}
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJ…"
          />
        </div>
        <div>
          <label className={labelCls}>Channel</label>
          <input className={inputCls} value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="e.g. private-chat.5" />
        </div>
        <div>
          <label className={labelCls}>Event</label>
          <input className={inputCls} value={event} onChange={(e) => setEvent(e.target.value)} placeholder="e.g. .NewMessageSent" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={connect}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Connect &amp; Subscribe
        </button>
        {connected && (
          <button
            onClick={disconnect}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Disconnect
          </button>
        )}
        {log.length > 0 && (
          <button
            onClick={() => setLog([])}
            className="ml-auto rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/50 hover:bg-white/10"
          >
            Clear
          </button>
        )}
      </div>

      <div className="min-h-48 max-h-96 overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs leading-6">
        {log.length === 0 ? (
          <span className="text-white/30">Log will appear here…</span>
        ) : (
          log.map((entry, i) => (
            <div
              key={i}
              className={
                entry.level === 'ok'
                  ? 'text-green-400'
                  : entry.level === 'error'
                    ? 'text-red-400'
                    : 'text-blue-400'
              }
            >
              <span className="text-white/30">[{entry.time}]</span> {entry.message}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
