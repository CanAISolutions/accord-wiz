## Open Questions (with recommended defaults)

1. Ontario SFL embedding vs. deep link
   - Default: deep link to official guide until license/asset pipeline finalized.
2. Storage path conventions beyond userId/leaseId
   - Default: `agreements/{auth.uid()}/{yyyy}/{leaseId}.pdf` for future partitioning; current tests use `{auth.uid()}/{leaseId}.pdf`.
3. Sentry/web-vitals rollout window
   - Default: configure DSN in env; disabled until post‑MVP smoke complete.



