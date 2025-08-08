import React, { useCallback, useMemo, useState } from 'react';
import { diffJson, Change } from 'diff';

function tryParseJson(input: string): any | Error {
  try {
    return JSON.parse(input);
  } catch (e) {
    return e as Error;
  }
}

function normalizeForCompare(value: unknown, options: { sortKeys: boolean; ignoreArrayOrder: boolean }): unknown {
  const { sortKeys, ignoreArrayOrder } = options;

  const deep = (v: any): any => {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) {
      const mapped = v.map(deep);
      return ignoreArrayOrder
        ? [...mapped].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
        : mapped;
    }
    const entries = Object.entries(v).map(([k, val]) => [k, deep(val)] as const);
    const sortedEntries = sortKeys ? entries.sort(([a], [b]) => a.localeCompare(b)) : entries;
    return Object.fromEntries(sortedEntries);
  };

  return deep(value);
}

function useJsonDiff(beforeText: string, afterText: string, sortKeys: boolean, ignoreArrayOrder: boolean): Change[] | { error: string } {
  return useMemo(() => {
    const beforeParsed = tryParseJson(beforeText.trim());
    const afterParsed = tryParseJson(afterText.trim());

    if (beforeParsed instanceof Error || afterParsed instanceof Error) {
      return { error: String((beforeParsed as Error)?.message || (afterParsed as Error)?.message) };
    }

    const beforeNorm = normalizeForCompare(beforeParsed, { sortKeys, ignoreArrayOrder });
    const afterNorm = normalizeForCompare(afterParsed, { sortKeys, ignoreArrayOrder });

    const beforeStr = JSON.stringify(beforeNorm, null, 2);
    const afterStr = JSON.stringify(afterNorm, null, 2);

    return diffJson(beforeStr, afterStr);
  }, [beforeText, afterText, sortKeys, ignoreArrayOrder]);
}

export function App(): React.ReactElement {
  const [before, setBefore] = useState(() => JSON.stringify({ a: 1, tags: ['b', 'a'] }, null, 2));
  const [after, setAfter] = useState(() => JSON.stringify({ a: 2, tags: ['a', 'b', 'c'] }, null, 2));
  const [sortKeys, setSortKeys] = useState(true);
  const [ignoreOrder, setIgnoreOrder] = useState(false);
  const [copied, setCopied] = useState(false);

  const diff = useJsonDiff(before, after, sortKeys, ignoreOrder);

  const onFormat = useCallback(() => {
    const b = tryParseJson(before);
    const a = tryParseJson(after);
    if (!(b instanceof Error)) setBefore(JSON.stringify(b, null, 2));
    if (!(a instanceof Error)) setAfter(JSON.stringify(a, null, 2));
  }, [before, after]);

  const onSwap = useCallback(() => {
    setBefore(after);
    setAfter(before);
  }, [before, after]);

  const renderedLines = useMemo(() => {
    if (Array.isArray(diff)) {
      const elements: React.ReactElement[] = [];
      let lineKey = 0;
      for (const part of diff) {
        const className = part.added ? 'add' : part.removed ? 'remove' : 'unchanged';
        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
        const text = part.value;
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const isLastEmpty = i === lines.length - 1 && line === '';
          if (isLastEmpty) continue;
          elements.push(
            <span key={`l-${lineKey++}`} className={`line ${className}`}>
              {prefix}
              {line}
            </span>
          );
        }
      }
      return elements;
    }
    return null;
  }, [diff]);

  const diffText = useMemo(() => {
    if (Array.isArray(diff)) {
      const lines: string[] = [];
      for (const part of diff) {
        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
        const text = part.value;
        const arr = text.split('\n');
        for (let i = 0; i < arr.length; i++) {
          const line = arr[i];
          const isLastEmpty = i === arr.length - 1 && line === '';
          if (isLastEmpty) continue;
          lines.push(prefix + line);
        }
      }
      return lines.join('\n');
    }
    return `JSON parse error: ${diff.error}`;
  }, [diff]);

  const onCopyDiff = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(diffText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = diffText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (_e) {
      // swallow
    }
  }, [diffText]);

  return (
    <>
      <header>
        <h1 style={{ margin: 0, fontSize: 18 }}>JSON Diff Viewer</h1>
      </header>
      <div className="controls">
        <button id="format" onClick={onFormat}>Format JSON</button>
        <button id="swap" onClick={onSwap}>Swap</button>
        <button onClick={onCopyDiff}>Copy diff</button>
        {copied && <span className="small">Copied!</span>}
        <label className="small">
          <input type="checkbox" checked={ignoreOrder} onChange={(e) => setIgnoreOrder(e.target.checked)} /> Ignore array order
        </label>
        <label className="small">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} /> Sort object keys
        </label>
      </div>
      <main>
        <div className="column">
          <label>Before</label>
          <textarea value={before} onChange={(e) => setBefore(e.target.value)} placeholder='{"a":1}' />
        </div>
        <div className="column">
          <label>After</label>
          <textarea value={after} onChange={(e) => setAfter(e.target.value)} placeholder='{"a":2}' />
        </div>
        <div className="output" id="output">
          {Array.isArray(diff) ? (
            renderedLines
          ) : (
            <div className="error">JSON parse error: {diff.error}</div>
          )}
        </div>
      </main>
    </>
  );
}
