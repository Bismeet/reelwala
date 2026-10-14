export type PointerSpring = { position: number; velocity: number };

/** Exact damped spring response: stable even when GPU frames arrive unevenly. */
export function advancePointerSpring(
  state: PointerSpring,
  target: number,
  seconds: number,
) {
  const goal = Math.max(-1, Math.min(1, target));
  const dt = Math.max(0, Math.min(seconds, 0.1));
  const decay = 9;
  const frequency = 8;
  const displacement = state.position - goal;
  const coefficient = (state.velocity + decay * displacement) / frequency;
  const cosine = Math.cos(frequency * dt);
  const sine = Math.sin(frequency * dt);
  const envelope = Math.exp(-decay * dt);
  state.position =
    goal + envelope * (displacement * cosine + coefficient * sine);
  state.velocity =
    envelope *
    (state.velocity * cosine -
      (decay * coefficient + frequency * displacement) * sine);
  if (
    Math.abs(state.position - goal) < 0.001 &&
    Math.abs(state.velocity) < 0.005
  ) {
    state.position = goal;
    state.velocity = 0;
  }
}
