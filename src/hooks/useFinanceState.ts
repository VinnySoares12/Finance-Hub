import { useCallback, useEffect, useRef, useState } from 'react';
import type { SetStateAction } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  deleteExpenses,
  deleteMonthlySavings,
  emptyFinanceState,
  fetchFinanceState,
  importLocalState,
  insertExpenses,
  readLegacyState,
  archiveLegacyState,
  saveMonthlySaving,
  saveSettings
} from '../data/financeRepository';
import type { FinanceSettings } from '../data/financeRepository';
import type { FinanceState } from '../types';

export type SyncStatus = 'loading' | 'ready' | 'saving' | 'error';

// Salário, meta e "guardado no mês" vêm de inputs que disparam a cada tecla /
// arrasto do slider. Sem debounce isso viraria uma requisição por caractere.
const WRITE_DEBOUNCE_MS = 700;

const isEmptyState = (state: FinanceState) =>
  state.salary === 0 &&
  state.goalName === '' &&
  state.goalAmount === 0 &&
  state.initialSaved === 0 &&
  Object.keys(state.monthlySavings ?? {}).length === 0 &&
  state.expenses.length === 0;

/**
 * Substitui o useLocalStorage mantendo a mesma assinatura de tupla, para que o
 * App continue usando `setFinance(current => ...)` sem saber que existe um
 * banco atrás. O estado local é otimista: a UI atualiza na hora e a escrita no
 * Supabase acontece em segundo plano, comparando o estado anterior com o novo
 * para descobrir o que mudou.
 */
export function useFinanceState() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [finance, setFinanceState] = useState<FinanceState>(emptyFinanceState);
  const [status, setStatus] = useState<SyncStatus>('loading');

  const financeRef = useRef(finance);
  const userIdRef = useRef(userId);
  const isReadyRef = useRef(false);

  // Fila serial: garante que as escritas cheguem no banco na mesma ordem em que
  // aconteceram na tela (ex.: adicionar e remover a mesma despesa em seguida).
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRef = useRef(0);
  const hasFailedRef = useRef(false);
  const timersRef = useRef(new Map<string, { handle: number; task: () => Promise<void> }>());

  userIdRef.current = userId;

  const applyState = useCallback((next: FinanceState) => {
    financeRef.current = next;
    setFinanceState(next);
  }, []);

  const enqueue = useCallback((task: () => Promise<void>) => {
    pendingRef.current += 1;
    setStatus('saving');

    queueRef.current = queueRef.current
      .then(async () => {
        await task();
        hasFailedRef.current = false;
      })
      .catch((error: unknown) => {
        console.error('[finance] falha ao salvar no Supabase', error);
        hasFailedRef.current = true;
      })
      .finally(() => {
        pendingRef.current -= 1;
        if (pendingRef.current === 0) {
          setStatus(hasFailedRef.current ? 'error' : 'ready');
        }
      });
  }, []);

  const schedule = useCallback(
    (key: string, task: () => Promise<void>) => {
      const timers = timersRef.current;
      const existing = timers.get(key);
      if (existing) window.clearTimeout(existing.handle);

      const handle = window.setTimeout(() => {
        timers.delete(key);
        enqueue(task);
      }, WRITE_DEBOUNCE_MS);

      timers.set(key, { handle, task });
    },
    [enqueue]
  );

  const cancelScheduled = useCallback((key: string) => {
    const timers = timersRef.current;
    const existing = timers.get(key);
    if (!existing) return;
    window.clearTimeout(existing.handle);
    timers.delete(key);
  }, []);

  // Dispara imediatamente o que ainda estava no debounce (troca de usuário,
  // desmontagem, aba fechando).
  const flushScheduled = useCallback(() => {
    const timers = timersRef.current;
    for (const [, entry] of timers) {
      window.clearTimeout(entry.handle);
      enqueue(entry.task);
    }
    timers.clear();
  }, [enqueue]);

  useEffect(() => {
    if (!userId) {
      isReadyRef.current = false;
      applyState(emptyFinanceState);
      setStatus('loading');
      return;
    }

    let active = true;
    isReadyRef.current = false;
    setStatus('loading');

    void (async () => {
      try {
        const remote = await fetchFinanceState(userId);
        if (!active) return;

        const legacy = readLegacyState();

        // Só importa se a conta ainda está zerada: assim o login em outro
        // navegador nunca sobrescreve o que já está no banco.
        if (legacy && isEmptyState(remote)) {
          const imported = await importLocalState(userId, legacy);
          if (!active) return;
          applyState(imported);
        } else {
          applyState(remote);
        }

        // Em qualquer caso o blob antigo sai do caminho (vira backup), para não
        // ser reimportado nem vazar dados de um usuário para o próximo que
        // logar neste navegador.
        if (legacy) archiveLegacyState();

        isReadyRef.current = true;
        setStatus('ready');
      } catch (error) {
        if (!active) return;
        console.error('[finance] falha ao carregar dados do Supabase', error);
        setStatus('error');
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, applyState]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const [, entry] of timers) window.clearTimeout(entry.handle);
      timers.clear();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => flushScheduled();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flushScheduled]);

  const reconcile = useCallback(
    (activeUserId: string, prev: FinanceState, next: FinanceState) => {
      if (
        prev.salary !== next.salary ||
        prev.savingsPercent !== next.savingsPercent ||
        prev.goalName !== next.goalName ||
        prev.goalAmount !== next.goalAmount ||
        prev.initialSaved !== next.initialSaved
      ) {
        const settings: FinanceSettings = {
          salary: next.salary,
          savingsPercent: next.savingsPercent,
          goalName: next.goalName,
          goalAmount: next.goalAmount,
          initialSaved: next.initialSaved
        };
        schedule('settings', () => saveSettings(activeUserId, settings));
      }

      const prevSavings = prev.monthlySavings ?? {};
      const nextSavings = next.monthlySavings ?? {};

      for (const [monthKey, amount] of Object.entries(nextSavings)) {
        if (prevSavings[monthKey] !== amount) {
          schedule(`savings:${monthKey}`, () => saveMonthlySaving(activeUserId, monthKey, amount));
        }
      }

      const removedMonths = Object.keys(prevSavings).filter((monthKey) => !(monthKey in nextSavings));
      if (removedMonths.length) {
        // Uma escrita ainda no debounce para um mês que acabou de ser apagado
        // recriaria a linha depois do delete.
        removedMonths.forEach((monthKey) => cancelScheduled(`savings:${monthKey}`));
        enqueue(() => deleteMonthlySavings(activeUserId, removedMonths));
      }

      const prevIds = new Set(prev.expenses.map((expense) => expense.id));
      const nextIds = new Set(next.expenses.map((expense) => expense.id));

      const added = next.expenses.filter((expense) => !prevIds.has(expense.id));
      if (added.length) enqueue(() => insertExpenses(activeUserId, added));

      const removedIds = [...prevIds].filter((id) => !nextIds.has(id));
      if (removedIds.length) enqueue(() => deleteExpenses(activeUserId, removedIds));
    },
    [schedule, cancelScheduled, enqueue]
  );

  const setFinance = useCallback(
    (updater: SetStateAction<FinanceState>) => {
      const current = financeRef.current;
      const next =
        typeof updater === 'function'
          ? (updater as (prev: FinanceState) => FinanceState)(current)
          : updater;

      // O App usa o padrão de devolver `current` quando não há nada a mudar.
      if (next === current) return;

      applyState(next);

      const activeUserId = userIdRef.current;
      // Enquanto carrega, o estado na tela ainda não reflete o banco — escrever
      // agora apagaria dados reais com os valores vazios do estado inicial.
      if (!activeUserId || !isReadyRef.current) return;

      reconcile(activeUserId, current, next);
    },
    [applyState, reconcile]
  );

  return [finance, setFinance, status] as const;
}
