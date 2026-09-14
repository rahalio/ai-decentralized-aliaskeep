import clsx from 'clsx';
import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-graphite">{subtitle}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-md border border-white/5 bg-charcoal-900/80 p-4 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: 'link' | 'amber' | 'coral' | 'seal' | 'graphite';
  children: ReactNode;
}) {
  const tones = {
    link: 'bg-link/15 text-link',
    amber: 'bg-amber/15 text-amber',
    coral: 'bg-coral/15 text-coral',
    seal: 'bg-seal/15 text-seal',
    graphite: 'bg-white/5 text-graphite',
  };
  return (
    <span
      className={clsx(
        'inline-flex rounded-sm px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-md bg-link px-3 py-2 text-sm font-medium text-charcoal-950 transition hover:bg-brand disabled:opacity-50',
        props.className
      )}
    />
  );
}

export function SecondaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-ink hover:bg-white/5 disabled:opacity-50',
        props.className
      )}
    />
  );
}

export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-md border border-dashed border-white/10 px-4 py-8 text-center text-sm text-graphite">
        {empty ?? 'No rows'}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-md border border-white/5">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-graphite">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-ink/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-md border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral">
      {message}
    </div>
  );
}
