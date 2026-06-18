import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { resolvePusherCluster, resolvePusherKey } from '../../config/resolvePusherConfig';
import { getToken } from '../../lib/authStorage';
import { API_BASE_URL } from '../../config/api';
import PageHeader from '../../components/layout/PageHeader';

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
  const [apiBase, setApiBase] = useState(() => API_BASE_URL);
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
    'w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20';
  const labelCls =
    'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Developer" title="Pusher" subtitle="Debugger" />

      {/* Connection form */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-1">
              Connection Settings.
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Fields are pre-filled from{' '}
              <code className="font-mono text-[#6610f2]">config.js</code> and your active session.
            </p>
          </div>

          {/* Status pill */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
              connected
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
            />
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Pusher Key</label>
            <input
              className={inputCls}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Cluster</label>
            <input
              className={inputCls}
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>API Base URL (must include /api)</label>
            <input
              className={inputCls}
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
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
            <input
              className={inputCls}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="e.g. private-chat.5"
            />
          </div>
          <div>
            <label className={labelCls}>Event</label>
            <input
              className={inputCls}
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="e.g. .NewMessageSent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={connect}
            className="bg-[#6610f2] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] transition-all"
          >
            Connect &amp; Subscribe
          </button>
          {connected && (
            <button
              onClick={disconnect}
              className="px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
            >
              Disconnect
            </button>
          )}
          {log.length > 0 && (
            <button
              onClick={() => setLog([])}
              className="ml-auto px-6 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
            >
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Event log */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 italic tracking-tight">
              Event Log.
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time output from the Pusher connection
            </p>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {log.length} {log.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="bg-slate-950 min-h-48 max-h-96 overflow-y-auto p-6 font-mono text-xs leading-7 rounded-b-[2.5rem]">
          {log.length === 0 ? (
            <span className="text-slate-500">Waiting for events…</span>
          ) : (
            log.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-slate-600 shrink-0">[{entry.time}]</span>
                <span
                  className={
                    entry.level === 'ok'
                      ? 'text-emerald-400'
                      : entry.level === 'error'
                        ? 'text-red-400'
                        : 'text-sky-400'
                  }
                >
                  {entry.message}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
