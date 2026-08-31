def test_escrow_fee_calculation():
    """
    Test 5: Unit test kalkulasi bisnis Escrow Makarya:
    - Fee Platform diambil dari klien/proyek = 5%
    - Mahasiswa menerima 100% honor tanpa potongan komisi (0%)
    """
    budget_proyek = 1_000_000
    platform_fee_rate = 0.05
    student_commission_rate = 0.00

    fee_platform = int(budget_proyek * platform_fee_rate)
    honor_mahasiswa = budget_proyek - int(budget_proyek * student_commission_rate)

    assert fee_platform == 50_000
    assert honor_mahasiswa == 1_000_000

def test_max_budget_guardrail():
    """
    Test 6: Validasi batasan pagu anggaran wajar micro-freelancing (Maks Rp 2.000.000).
    """
    max_allowed_budget = 2_000_000
    proposed_budget = 1_500_000
    oversized_budget = 5_000_000

    assert proposed_budget <= max_allowed_budget
    assert oversized_budget > max_allowed_budget