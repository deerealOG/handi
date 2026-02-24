- [x] Route admin root to tabbed admin screens (`/admin/(tabs)/index`) so updated admin content is shown by default.
- [x] Wire provider tab actions/buttons/cards to valid routes and keep interactions consistent.
- [x] Wire admin tab actions/buttons/cards to valid routes, and expose hidden admin tools from in-tab actions.
- [x] Fix provider bookings category pill padding/alignment and normalize card/button spacing consistency.
- [x] Run lint and verify target routes exist for all newly wired actions.

## Review
- Admin root now redirects to the tabbed admin flow.
- Provider and admin buttons/cards now have concrete `onPress` navigation/actions.
- Provider booking filter pills were increased and normalized for better padding/alignment.
- Hidden admin tabs are accessible via "More Admin Tools" in admin overview.
- `npm run lint` passes.
