---
applyTo: "**"
---

Comments should add value by explaining something not immediately apparent
reading the code as someone who generally understands code. Documentation should
assume a baseline level of knowledge and focus on manual tasks and specific pain
points in the development workflow.

All code should be continuously refactored to avoid leaving parcels of previous
logic. Comments and documentation need to be updated at the same time as code,
but should not include information that frequently changes.

The goal of any solution is to solve it the simplest way possible. Git diffs
should not change unless there is an obvious reason for doing so.

It is better to adjust project wide config, including linters and type checkers,
than frequently ignoring them or creating unwieldy solutions that abide by the
existing rules.
