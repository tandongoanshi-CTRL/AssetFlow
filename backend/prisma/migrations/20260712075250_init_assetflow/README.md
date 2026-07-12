Migration note

This repo already contains an initial migration directory.

Next steps (performed by tooling) will create new migrations implementing:
- Partial unique index on allocations: only one ACTIVE allocation per asset
- Booking overlap exclusion constraint for resource_bookings where status != CANCELLED

