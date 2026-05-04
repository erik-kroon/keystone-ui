import { createMemo, createSignal, createUniqueId, onCleanup, type Accessor } from "solid-js";

export type RegisteredIdsApi = {
  ids: Accessor<readonly string[]>;
  register: (id?: Accessor<string | undefined>) => () => void;
};

export function createKeystoneId(
  part: string,
  id?: Accessor<string | undefined>,
): Accessor<string> {
  const fallback = `keystone-${part}-${createUniqueId()}`;

  return createMemo(() => id?.() ?? fallback);
}

export const createStableId = createKeystoneId;

export function createRegisteredIds(defaultId?: Accessor<string | undefined>): RegisteredIdsApi {
  const [registeredIds, setRegisteredIds] = createSignal<readonly Accessor<string | undefined>[]>(
    defaultId ? [defaultId] : [],
  );

  const register = (id?: Accessor<string | undefined>) => {
    if (!id) {
      return () => {};
    }

    setRegisteredIds((current) => [...current.filter((candidate) => candidate !== id), id]);

    let active = true;
    const unregister = () => {
      if (!active) {
        return;
      }

      active = false;
      setRegisteredIds((current) => current.filter((candidate) => candidate !== id));
    };

    onCleanup(unregister);
    return unregister;
  };

  const ids = createMemo(() => {
    const seen = new Set<string>();
    const next: string[] = [];

    for (const id of registeredIds()) {
      const value = id();

      if (value && !seen.has(value)) {
        seen.add(value);
        next.push(value);
      }
    }

    return next;
  });

  return { ids, register };
}

export function mergeIds(...ids: Array<string | undefined | null | false>): string | undefined {
  const next = ids.filter(Boolean) as string[];

  return next.length > 0 ? next.join(" ") : undefined;
}
