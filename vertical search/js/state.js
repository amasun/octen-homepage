/**
 * Shared Reactive State for Vertical Search Demo
 */
export const state = {
  isAutoLooping: true,
  isUserHovered: false,
  currentSequenceId: 0,
  currentActiveStep: 'typing',
  activeAnimations: [],
  currentVerticalKey: 'news',
  currentSelectedSubjectIdx: 0,
  timelineScrollCleanup: null,
};

export function clearActiveAnimations() {
  state.activeAnimations.forEach(a => {
    try { a.cancel(); } catch (e) {}
  });
  state.activeAnimations = [];
}
