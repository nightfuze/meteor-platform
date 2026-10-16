const STORAGE_KEY = "meteor_favorites";
export const FAVORITES_CHANGED = "meteor:favorites-changed";

const isPositiveInt = (value: number): value is number => value > 0;

const parseIds = (raw: string | null): number[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.map(Number).filter(isPositiveInt))];
  } catch {
    return [];
  }
};

const readIds = (): number[] => parseIds(window.localStorage.getItem(STORAGE_KEY));

const writeIds = (ids: number[]): void => {
  const unique = [...new Set(ids.filter(isPositiveInt))];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED, { detail: { favorites: unique } }));
};

const toggle = (id: number): boolean => {
  const current = readIds();
  const active = !current.includes(id);
  writeIds(active ? [id, ...current] : current.filter((entry) => entry !== id));
  return active;
};

const subscribe = (listener: (ids: number[]) => void): (() => void) => {
  const onChange = () => listener(readIds());
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener(FAVORITES_CHANGED, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(FAVORITES_CHANGED, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

const setActiveButton = (button: HTMLButtonElement, active: boolean): void => {
  button.dataset.favoriteActive = String(active);
  button.setAttribute("aria-pressed", String(active));
  button.classList.toggle("favorite-button--active", active);
  button.setAttribute("aria-label", active ? "Удалить из избранного" : "Добавить в избранное");

  const label = button.querySelector("[data-favorite-label]");
  if (label) label.textContent = active ? "В избранном" : "В избранное";
};

interface MountOptions {
  filterCards?: boolean;
}

const mount = (root: ParentNode = document, options: MountOptions = {}): (() => void) => {
  const { filterCards = false } = options;

  const sync = (ids: number[] = readIds()) => {
    const set = new Set(ids);

    root.querySelectorAll<HTMLButtonElement>("[data-favorite-button]").forEach((button) => {
      const id = Number(button.dataset.gameId);
      if (!isPositiveInt(id)) return;
      setActiveButton(button, set.has(id));
    });

    if (!filterCards) return;

    let visibleCards = 0;
    root.querySelectorAll<HTMLElement>("[data-game-card]").forEach((card) => {
      const id = Number(card.dataset.gameId);
      const visible = set.has(id);
      card.style.display = visible ? "" : "none";
      if (visible) visibleCards += 1;
    });

    const empty = root.querySelector<HTMLElement>("[data-favorites-empty]");
    if (empty) empty.hidden = visibleCards > 0;
  };

  const onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>("[data-favorite-button]");
    if (!button) return;

    const id = Number(button.dataset.gameId);
    if (!isPositiveInt(id)) return;

    toggle(id);
  };

  document.addEventListener("click", onClick);
  const unsubscribe = subscribe(sync);
  sync();

  return () => {
    document.removeEventListener("click", onClick);
    unsubscribe();
  };
};

export const favorites = {
  getIds: readIds,
  isFavorite(id: number): boolean {
    return readIds().includes(id);
  },
  toggle,
  subscribe,
  mount,
};
