interface Props {
  toolbar: React.ReactNode;
  canvas: React.ReactNode;
  statusBar: React.ReactNode;
  sidebar: React.ReactNode;
}

export function AppShell({ toolbar, canvas, statusBar, sidebar }: Props) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-neutral-900 text-white">
      <aside
        aria-label="Tools"
        className="flex w-14 flex-col items-center gap-2 border-r border-neutral-700 bg-neutral-800 py-3"
      >
        {toolbar}
      </aside>
      <main
        aria-label="Canvas area"
        className="flex flex-1 flex-col overflow-auto"
      >
        <div className="flex flex-1 items-center justify-center p-4">
          {canvas}
        </div>
        {statusBar}
      </main>
      <aside
        aria-label="Properties"
        className="flex w-56 flex-col gap-4 border-l border-neutral-700 bg-neutral-800 p-4"
      >
        {sidebar}
      </aside>
    </div>
  );
}
