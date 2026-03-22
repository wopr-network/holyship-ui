import { ConnectRepos } from "@/components/onboarding/connect-repos";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import type { Entity, Flow } from "@/lib/holyship-client";
import { getEntitiesByState, getFlows, getHolyshipStatus } from "@/lib/holyship-client";

export const dynamic = "force-dynamic";

/**
 * Synthesize Flow objects from status response when /api/flows doesn't exist.
 * Status returns { flows: { [flowId]: { [stateName]: count } } }
 */
function flowsFromStatus(statusFlows: Record<string, Record<string, number>>): Flow[] {
  return Object.entries(statusFlows).map(([id, states]) => ({
    id,
    name: id,
    states: Object.keys(states).map((name) => ({ id: name, name })),
    transitions: [],
  }));
}

export default async function DashboardPage() {
  let flows: Flow[] = [];
  let counts: Record<string, Record<string, number>> = {};
  const entityMap: Record<string, Entity[]> = {};

  try {
    const status = await getHolyshipStatus();
    counts = status.flows;

    // Try to get full flow definitions; fall back to synthesizing from status
    try {
      flows = await getFlows();
    } catch {
      flows = flowsFromStatus(counts);
    }

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
  } catch {
    // API unreachable — show onboarding
  }

  if (flows.length === 0) {
    return <ConnectRepos />;
  }

  return (
    <div>
      <div className="px-6 pt-5 pb-0 flex items-center gap-3">
        <h1
          className="text-sm font-bold tracking-[0.3em] uppercase"
          style={{ color: "var(--foreground)" }}
        >
          Pipeline
        </h1>
        <span className="text-xs tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          / entity board
        </span>
      </div>
      <PipelineBoard initial={{ flows, entityMap, counts }} />
    </div>
  );
}
