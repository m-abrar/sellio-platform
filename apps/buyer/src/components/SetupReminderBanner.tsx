import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy, Settings2 } from 'lucide-react';
import {
  exampleConfigSnippet,
  getPortalSetupContext,
  type PortalSetupIssue,
} from '../config/portalSetup';

function issueBadge(issue: PortalSetupIssue) {
  if (issue.id.endsWith('-missing')) return 'Not set';
  if (issue.id.endsWith('-placeholder')) return 'Placeholder';
  if (issue.id.endsWith('-demo-default')) return 'Demo default';
  if (issue.id.endsWith('-localhost')) return 'Localhost';
  return 'Needs update';
}

export default function SetupReminderBanner() {
  const context = useMemo(() => getPortalSetupContext(), []);
  const [copied, setCopied] = useState(false);

  if (!context.isIncomplete) {
    return null;
  }

  const snippet = exampleConfigSnippet(context);
  const primary = context.issues[0];

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div role="alert" className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-4 py-5 text-amber-950 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-amber-800">
                {context.panelLabel} setup required
              </p>
              <h2 className="text-lg font-extrabold text-amber-950">{primary.title}</h2>
              <p className="text-sm text-amber-900/90">{primary.detail}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700">
                  Current config.js values
                </p>
                <div className="mt-3 space-y-2">
                  {context.issues.map((issue) => (
                    <div key={issue.id} className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {issue.field}
                        </span>
                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                          {issueBadge(issue)}
                        </span>
                      </div>
                      <code className="block break-all font-mono text-xs text-amber-950">
                        {issue.field === 'apiUrl' ? context.apiUrl || '(empty)' : context.storefrontUrl || '(empty)'}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700">
                    Example config.js
                  </p>
                  <button
                    type="button"
                    onClick={() => void copySnippet()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 transition hover:bg-amber-100"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-emerald-300">
                  <code>{snippet}</code>
                </pre>
              </div>
            </div>

            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-amber-900/90">
              <li>Open <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">config.js</code> in your buyer subdomain root (next to <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">index.html</code>).</li>
              <li>Replace <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">apiUrl</code> with your Laravel site URL + <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">/api</code>.</li>
              <li>Set <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">storefrontUrl</code> to your public storefront URL.</li>
              <li>Save the file and refresh this page. No rebuild is required.</li>
            </ol>

            <p className="flex items-center gap-2 text-xs font-bold text-amber-800/90">
              <Settings2 className="h-4 w-4 shrink-0" />
              In Laravel admin go to Settings → General, set Customer App URL to this panel&apos;s full URL (CORS updates automatically).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
