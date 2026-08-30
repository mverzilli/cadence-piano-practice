# Design decisions

Status: **Proposed baseline — attested when the complete normative set is approved**

This log records important rationale, not every implementation choice. Later
entries supersede earlier ones explicitly rather than rewriting history.

## D-001 — Play before fixing

Decision: The guided sequence begins with an uninterrupted diagnostic
playthrough before deliberate correction.

Rationale: The first attempt supplies evidence about actual failure points.
Starting with correction encourages work on passages that look difficult rather
than what happened in context.

Consequences: `R-LISTEN-FIRST` precedes diagnosis. Cadence does not need to
judge the playing automatically.

## D-002 — Use measure-beat ranges

Decision: Passage and Spot locations are inclusive ranges of measure-beat
coordinates. Meter numerator determines selectable beat positions.

Rationale: A free-text section name is too imprecise for locating musical
problems. Numerator positions provide a simple current model even for compound
meters such as `6/8`.

Consequences: `I-VALID-COORDINATE` and `I-RANGE-ORDER` apply at every input and
persistence boundary. Compound-beat interpretation may be revisited later.

## D-003 — Separate Practice Prompt from Session Result

Decision: The next session carries forward what to practise, not the outcome of
the completed session.

Rationale: Passage, goal, Spots, focus, and chunk usually describe where the
pianist should resume. Repetitions, pressure result, and reflection describe a
historical attempt and remain visible in History.

Consequences: `C-PRACTICE-PROMPT`, `C-SESSION-RESULT`,
`I-PROMPT-RESULT-SEPARATION`, and `R-PROMPT-CARRY-FORWARD` have distinct stable
identity.

## D-004 — Spots continue across sessions

Decision: A Diagnosed Spot has stable identity and may be encountered in
multiple Practice Sessions.

Rationale: Review intent refers to the same continuing practice concern, not a
new anonymous copy with coincidentally identical coordinates.

Consequences: Session-specific observations belong to Spot Encounters. The
physical model must eventually replace anonymous embedded Spot JSON. A formal
resolved lifecycle is deferred until use demonstrates what it should mean.

## D-005 — Completed sessions are mutable

Decision: Practice Sessions may be edited in place after completion.

Rationale: Cadence is a working practice record, not a compliance audit log.
Users should be able to correct or improve their notes.

Consequences: History supports updates with ownership and validation. Git and
development provenance are separate from product-level record history.

## D-006 — Design for isolated user libraries

Decision: Cadence anticipates multiple authenticated users, each with an
isolated Practice Library.

Rationale: Owner-only deployment is a temporary access configuration, not the
domain ownership model. Practice data is private.

Consequences: `I-LIBRARY-ISOLATION` is a release gate for sharing the Site.
Identity and row ownership must be server-enforced and mechanically tested.

## D-007 — Treat current workflow and coaching as provisional truth

Decision: The current five-stage workflow, Practice Focus vocabulary, and
coaching mappings are normative until deliberately changed, while remaining
explicitly open to iteration from real use.

Rationale: The app is a young production-worthy tool and a learning experiment.
Calling behavior provisional must not allow implementation and intent to drift
silently.

Consequences: Usability-driven changes update `practice-workflow.md` through a
reviewed PR. Agents surface the proposed semantic change rather than merely
rearranging UI code.

## D-008 — Specs gatekeep intent

Decision: The attested spec graph is authoritative for intent. DDD supplies
ubiquitous language; types, tests, diagrams, schemas, and code provide useful
representations and evidence.

Rationale: Semantic unicity does not require a single representation. Agreement
between redundant representations increases confidence; disagreement identifies
work requiring reconciliation.

Consequences: Agents translate between representations but do not become the
authority. Greptile reviews PRs against the specs, and change-specific review
maps remain non-normative projections.
