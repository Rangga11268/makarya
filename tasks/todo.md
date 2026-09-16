# Task Breakdown: Bug Fix & Advanced Roadmap Features (Makarya)

## Task 1: Fix Deliverable Visibility Bug for Mahasiswa (Root Cause Fix)
- [x] Backend: Update all proposal status queries across `submissions.py`, `projects.py`, `chat.py`, `auth.py`, `talents.py`, `ratings.py`, and `disputes.py` from `Proposal.status == ProposalStatus.ACCEPTED` to `Proposal.status.in_([ProposalStatus.ACCEPTED, ProposalStatus.COMPLETED])`.
- [x] Web: In `ProposalBoardPage.jsx`, ensure `accepted` filter includes `COMPLETED`, ensuring `mhsSubmissions[p.project_id]` is always populated.
- [x] Mobile: In `ProjectDetailScreen.jsx` and `WorkroomActiveView.jsx`, use `getAllByProject` fallback to `getByProject` and render deliverable cards reliably for both active and completed states.

## Task 2: Role-based Kanban & Milestone Progress Tracker
- [x] Web: Add interactive milestone tracker in `WorkroomWorkspaceDetail.jsx` allowing students to check off subtasks per role and UMKM to track real-time progress.
- [x] Mobile: Add milestone checklist in `WorkroomActiveView.jsx` (Mobile).

## Task 3: Live In-App Document & Media Previewer
- [x] Web: Create `MediaPreviewModal.jsx` for instant in-app viewing of image deliverables, PDF documents, video walkthroughs, and embedded Figma/live links.
- [x] Mobile: In-app preview trigger in deliverable card.

## Task 4: Payment Gateway Sandbox Simulator (Midtrans / Xendit)
- [x] Web: Create `PaymentGatewayModal.jsx` simulating Virtual Account (BCA, Mandiri, BNI, BRI), QRIS (with simulated scanner/pay button), and E-Wallet (GoPay/ShopeePay) for Wallet Top-Up and Withdrawal.
- [x] Mobile: Integrate interactive payment gateway simulator in `WalletScreen.jsx` & `WalletTransactionModal.jsx`.

## Task 5: Official PDF Invoice & Escrow Receipt Export
- [x] Web: Official printable/PDF escrow voucher and transaction receipt in `WalletPage.jsx`.

## Task 6: Thesis Usability (SUS Form) & Security Test Component
- [x] Web: Create `SystemUsabilityScaleModal.jsx` (10 standard SUS questions with automatic score computation 0-100 & percentile grading) for thesis defense data collection.
- [x] Add menu shortcut in footer & wallet header for respondents (UMKM and Mahasiswa) to test and generate SUS score reports.

## Task 7: Full Verification & GitHub Deployment
- [x] Verify Web build with `npm run build`.
- [x] Verify Python backend compilation.
- [x] Commit and push all updates to GitHub `main`.
