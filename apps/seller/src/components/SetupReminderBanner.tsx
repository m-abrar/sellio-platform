import { HiOutlineCog6Tooth, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { getPortalSetupIssues } from '../config/portalSetup';

export default function SetupReminderBanner() {
  const issues = getPortalSetupIssues();

  if (issues.length === 0) {
    return null;
  }

  const primary = issues[0];

  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <HiOutlineExclamationTriangle className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-black uppercase tracking-wide text-amber-800">
            Connection not configured
          </p>
          <p className="text-sm font-bold text-amber-950">{primary.title}</p>
          <p className="text-sm text-amber-900/90">{primary.detail}</p>

          <ol className="list-decimal space-y-1 pl-5 text-sm text-amber-900/90">
            <li>Open <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">config.js</code> in your seller subdomain folder (cPanel File Manager or FTP).</li>
            <li>Set <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">apiUrl</code> to your Laravel site + <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">/api</code>.</li>
            <li>Example: <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">https://marketplace.yourdomain.com/api</code></li>
            <li>Save the file and refresh this page.</li>
          </ol>

          <p className="flex items-center gap-2 text-xs font-semibold text-amber-800/90">
            <HiOutlineCog6Tooth className="h-4 w-4 shrink-0" />
            Also set <code className="font-mono">SELLER_APP_URL</code> in Laravel <code className="font-mono">.env</code> for CORS.
          </p>
        </div>
      </div>
    </div>
  );
}
