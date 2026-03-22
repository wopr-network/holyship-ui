"use client";

import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { Entity, Flow, FlowState, FlowTransition } from "@/lib/holyship-client";
import type { HolyshipConnectionStatus, HolyshipEvent } from "@/lib/holyship-ws";
// HolyshipConnectionStatus used in handleWsStatus param type
import { useHolyshipEvents } from "@/lib/holyship-ws";
import { StateColumn } from "./state-column";

/**
 * Sort flow states in pipeline order using the transition graph.
 * Walks the happy path from initialState, then appends any remaining states.
 */
function sortStatesByPipeline(
  states: FlowState[],
  transitions: FlowTransition[],
  initialState?: string,
): FlowState[] {
  if (states.length === 0 || transitions.length === 0) return states;

  // Build adjacency: fromState → [toState, ...] (first edge = happy path)
  const forward = new Map<string, string[]>();
  for (const t of transitions) {
    const list = forward.get(t.fromState) ?? [];
    if (!list.includes(t.toState)) list.push(t.toState);
    forward.set(t.fromState, list);
  }

  const stateMap = new Map(states.map((s) => [s.name, s]));
  const visited = new Set<string>();

  // 1. Walk the happy path — always follow the FIRST edge (primary transition)
  const happyPath: FlowState[] = [];
  let current: string | undefined = initialState ?? states[0]?.name;
  while (current && !visited.has(current)) {
    visited.add(current);
    const state = stateMap.get(current);
    if (state) happyPath.push(state);
    const nexts: string[] = forward.get(current) ?? [];
    current = nexts.find((n) => !visited.has(n));
  }

  // 2. BFS from happy-path nodes to pick up side states (fix, stuck, etc.)
  const sideStates: FlowState[] = [];
  const queue = [...happyPath.map((s) => s.name)];
  while (queue.length > 0) {
    const name = queue.shift();
    if (!name) continue;
    const nexts = forward.get(name) ?? [];
    for (const n of nexts) {
      if (!visited.has(n)) {
        visited.add(n);
        const state = stateMap.get(n);
        if (state) sideStates.push(state);
        queue.push(n);
      }
    }
  }

  // 3. Append any states not reachable from the graph (orphans)
  const orphans: FlowState[] = [];
  for (const s of states) {
    if (!visited.has(s.name)) orphans.push(s);
  }

  return [...happyPath, ...sideStates, ...orphans];
}

interface BoardState {
  flows: Flow[];
  entityMap: Record<string, Entity[]>; // key: `${flowId}::${stateName}`
  counts: Record<string, Record<string, number>>; // flowId -> stateName -> count
}

interface PipelineBoardProps {
  initial: BoardState;
}

export function PipelineBoard({ initial }: PipelineBoardProps) {
  const [board, setBoard] = useState<BoardState>(initial);
  const [wsStatus, setWsStatus] = useState<"connecting" | "live" | "error" | "closed">(
    "connecting",
  );
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refreshEntities = useCallback(async () => {
    try {
      const { getHolyshipStatus, getFlows, getEntitiesByState } = await import(
        "@/lib/holyship-client"
      );
      const [status, flows] = await Promise.all([getHolyshipStatus(), getFlows()]);
      const entityMap: Record<string, Entity[]> = {};
      await Promise.all(
        flows.flatMap((flow) =>
          flow.states.map(async (state) => {
            const key = `${flow.id}::${state.name}`;
            try {
              entityMap[key] = await getEntitiesByState(flow.name, state.name);
            } catch {
              entityMap[key] = [];
            }
          }),
        ),
      );
      setBoard({ flows, entityMap, counts: status.flows });
      setLastRefresh(new Date());
    } catch {
      // silently ignore poll errors
    }
  }, []);

  // Poll every 10s as fallback
  useEffect(() => {
    const t = setInterval(refreshEntities, 10000);
    return () => clearInterval(t);
  }, [refreshEntities]);

  const handleWsEvent = useCallback(
    (event: HolyshipEvent) => {
      if (
        event.type === "entity.transitioned" ||
        event.type === "entity.created" ||
        event.type === "entity.claimed"
      ) {
        refreshEntities();
      }
    },
    [refreshEntities],
  );

  const handleWsStatus = useCallback((status: HolyshipConnectionStatus) => {
    if (status === "open") setWsStatus("live");
    else if (status === "error") setWsStatus("error");
    else if (status === "closed") setWsStatus("closed");
    else setWsStatus("connecting");
  }, []);

  useHolyshipEvents(handleWsEvent, handleWsStatus);

  const flows = board.flows;

  return (
    <div>
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-6 py-2 border-b text-xs"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{
                background:
                  wsStatus === "live"
                    ? "var(--accent-green)"
                    : wsStatus === "error" || wsStatus === "closed"
                      ? "var(--accent-red)"
                      : "var(--accent-amber)",
              }}
            />
            {wsStatus === "live"
              ? "LIVE"
              : wsStatus === "error"
                ? "DISCONNECTED"
                : wsStatus === "closed"
                  ? "OFFLINE"
                  : "CONNECTING"}
          </span>
          <span>refreshed {lastRefresh.toLocaleTimeString()}</span>
        </div>
        <button
          type="button"
          onClick={refreshEntities}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <Spinner size={12} />
          refresh
        </button>
      </div>

      {/* Board */}
      <div className="p-6 overflow-x-auto">
        {flows.length === 0 ? (
          <div className="text-sm text-center py-16" style={{ color: "var(--muted-foreground)" }}>
            no flows configured
          </div>
        ) : (
          flows.map((flow) => {
            const sortedStates = sortStatesByPipeline(
              flow.states,
              flow.transitions,
              flow.initialState,
            );
            return (
              <div key={flow.id} className="mb-10">
                <h2
                  className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {flow.name}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {sortedStates.map((state) => {
                    const key = `${flow.id}::${state.name}`;
                    const count = board.counts[flow.id]?.[state.name] ?? 0;
                    const entities = board.entityMap[key] ?? [];
                    return (
                      <StateColumn key={state.id} state={state} count={count} entities={entities} />
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
