import type { ToolName } from "../../types";

interface Props {
  tool: ToolName;
  zoom: number;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNew: () => void;
  onClear: () => void;
  onSetTool: (t: ToolName) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHelp: () => void;
}

const TOOLS: {
  name: ToolName;
  label: string;
  shortcut: string;
  svg: React.ReactNode;
}[] = [
  {
    name: "pencil",
    label: "Pencil",
    shortcut: "P",
    svg: (
      <svg
        viewBox="0 0 16 16"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
      </svg>
    ),
  },
  {
    name: "eraser",
    label: "Eraser",
    shortcut: "E",
    svg: (
      <svg
        viewBox="0 0 16 16"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
      </svg>
    ),
  },
  {
    name: "fill",
    label: "Fill",
    shortcut: "F",
    svg: (
      <svg
        viewBox="0 0 16 16"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a3 3 0 0 0-.71-.515c-.217-.104-.56-.205-.882-.02-.247.14-.4.396-.4.673 0 .75.484 1.42 1.019 1.947.534.527 1.23 1.035 1.934 1.517-.14.19-.27.38-.39.575C5.77 5.587 5.293 6 4.5 6a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1c-.793 0-1.27-.413-1.913-1.171-.13-.195-.26-.385-.4-.575.704-.482 1.4-.99 1.934-1.517C11.656 2.19 12.14 1.52 12.14.75c0-.277-.153-.533-.4-.673-.321-.185-.665-.084-.882.02a3 3 0 0 0-.71.515c-.423.395-.892.966-1.35 1.643-.346.51-.694 1.094-1.048 1.706H7.24C6.886 3.874 6.538 3.29 6.192 2.78M8 7.5a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5M2.5 14a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
      </svg>
    ),
  },
  {
    name: "picker",
    label: "Color picker",
    shortcut: "K",
    svg: (
      <svg
        viewBox="0 0 16 16"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zm-1 .708.647.646-3.5 3.5-.647-.646zM2 12.707l7-7 .646.647-7 7H2z" />
      </svg>
    ),
  },
];

function IconBtn({
  label,
  title,
  onClick,
  disabled = false,
  active = false,
  children,
}: {
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex h-10 w-10 items-center justify-center rounded transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-800",
        "disabled:cursor-not-allowed disabled:opacity-30",
        active
          ? "bg-white text-neutral-900"
          : "text-neutral-300 hover:bg-neutral-700 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <hr className="my-1 w-8 border-neutral-700" aria-hidden="true" />;
}

export function Toolbar({
  tool,
  zoom,
  showGrid,
  canUndo,
  canRedo,
  onNew,
  onClear,
  onSetTool,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onUndo,
  onRedo,
  onHelp,
}: Props) {
  return (
    <>
      <IconBtn label="New canvas" title="New canvas (Ctrl+N)" onClick={onNew}>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
      </IconBtn>

      <IconBtn label="Clear canvas" title="Clear canvas" onClick={onClear}>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </IconBtn>

      <Divider />

      <div
        role="radiogroup"
        aria-label="Drawing tools"
        className="flex flex-col gap-1"
      >
        {TOOLS.map((t) => (
          <button
            key={t.name}
            role="radio"
            aria-checked={tool === t.name}
            aria-label={t.label}
            title={`${t.label} (${t.shortcut})`}
            onClick={() => onSetTool(t.name)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-800",
              tool === t.name
                ? "bg-white text-neutral-900"
                : "text-neutral-300 hover:bg-neutral-700 hover:text-white",
            ].join(" ")}
          >
            {t.svg}
          </button>
        ))}
      </div>

      <Divider />

      <IconBtn
        label="Undo"
        title="Undo (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
        </svg>
      </IconBtn>
      <IconBtn
        label="Redo"
        title="Redo (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
        </svg>
      </IconBtn>

      <Divider />

      <IconBtn label="Zoom in" title="Zoom in (+)" onClick={onZoomIn}>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
          <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
          <path
            fillRule="evenodd"
            d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
          />
        </svg>
      </IconBtn>
      <span
        className="text-center font-mono text-xs text-neutral-400"
        aria-live="polite"
        aria-label={`Zoom level: ${zoom}×`}
      >
        {zoom}×
      </span>
      <IconBtn label="Zoom out" title="Zoom out (-)" onClick={onZoomOut}>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
          <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
          <path
            fillRule="evenodd"
            d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </IconBtn>

      <Divider />

      <IconBtn
        label={showGrid ? "Hide grid" : "Show grid"}
        title="Toggle grid (G)"
        onClick={onToggleGrid}
        active={showGrid}
      >
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
        </svg>
      </IconBtn>

      <Divider />

      <IconBtn label="Keyboard shortcuts" title="Help (?)" onClick={onHelp}>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
        </svg>
      </IconBtn>
    </>
  );
}
