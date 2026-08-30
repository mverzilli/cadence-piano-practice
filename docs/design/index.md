# Cadence design knowledge

Status: **Draft baseline — pending human attestation**

This directory contains the normative design of Cadence. It is deliberately
small enough to read as a complete set. Application code is an implementation
of this design; it is not the authority on intent when the two disagree.

## Authority

- Martin Verzilli owns and attests product intent.
- Agents may draft, translate, cross-reference, and identify disagreement.
- Agents and automated reviewers do not silently establish or change intent.
- Greptile review is evidence about a proposed change, not design authority.
- Normative changes are proposed and reviewed through pull requests.

Approval of the baseline PR attests:

> I have read this normative set in full. It accurately describes the system I
> intend to build, including explicitly documented gaps and provisional areas.

## Normative graph

| Artifact | Semantic responsibility |
| --- | --- |
| [Domain](domain.md) | Ubiquitous language, concept identity, relationships, and domain invariants |
| [Practice workflow](practice-workflow.md) | User-visible requirements, states, transitions, and prompt continuity |
| [System](system.md) | Runtime boundaries, interfaces, ownership, persistence, risks, and conformance gaps |
| [Decisions](decisions.md) | Rationale whose loss could cause future design drift |

Each assertion has one normative home. Other artifacts may intentionally
represent it again—as a diagram, type, schema, test, or code—but should cite its
stable identifier when doing so. Redundancy is useful; disagreement is a signal.

## Identifier conventions

- `C-*`: domain concept
- `V-*`: domain value
- `I-*`: invariant
- `R-*`: externally observable requirement
- `S-*`: system obligation
- `D-*`: design decision

Identifiers are stable semantic handles. Wording and representations may
improve without changing identity. A materially different assertion receives a
new identifier or explicitly supersedes the old one.

## Formalization gradient

Use the least ceremonial representation that makes an assertion clear and
checkable: prose, examples, Mermaid, schemas, types, API tests, property tests,
or architecture checks. Cadence has no custom specification language.

## Change protocol

1. Read the relevant normative nodes before substantial implementation.
2. If implementation reveals a change to intent, propose the spec or decision
   update; do not silently reconcile it in code.
3. Keep normative content concise enough for complete human review.
4. Generate a change-specific review map after the baseline. It should project
   affected concepts, requirements, decisions, evidence, risks, and critical
   implementation regions. It is not normative and need not be permanent.
5. Merge only after human review of intent. Deployment follows merge, not PR
   creation.

## Non-normative provenance

Git history, development conversations, generated plans, and intermediate
artifacts remain available as provenance. They are source material for agents
and investigations; reviewers are not required to read them.

## Attestation history

| Revision | Status | Attested by | Date |
| --- | --- | --- | --- |
| Initial reconstruction | Draft | — | — |
