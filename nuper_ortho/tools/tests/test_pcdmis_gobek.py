#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Birim Testi: Göbek Bağı Oluğu 2-Bağlama (OP10 / OP20) PC-DMIS & ANSI DMIS 5.3 Doğrulaması
"""

import os
import pytest
from tools.pcdmis_gobek_generator import generate_gobek_pcdmis_dmis


def test_gobek_pcdmis_generation():
    content = generate_gobek_pcdmis_dmis()
    assert "GOBEK_BAGI_OLUGU_OP10_OP20" in content
    assert "10153669" in content
    assert "395.50 x 91.02 x 87.66 mm" in content


def test_probe_and_extender_configuration():
    content = generate_gobek_pcdmis_dmis()
    # Ana prob: Ø2x20 + 20mm uzatma (40mm serbest boy)
    assert "LOADPROBE/O2X20+20" in content
    assert "TIP/T1A0B0" in content
    assert "TIP/T1A90B0" in content
    assert "TIP/T1A90B90" in content
    # Derin kademe ve fatura probu: Ø2x30 + 50mm uzatma
    assert "LOADPROBE/O2X30+50" in content
    assert "TIP/T2A0B0" in content


def test_two_setups_op10_and_op20():
    content = generate_gobek_pcdmis_dmis()
    # OP10 Bölümü
    assert "BAGLAMA 1 (OP10)" in content
    assert "F(DATUM_A) = FEAT/PLANE" in content
    assert "F(DATUM_B) = FEAT/LINE" in content
    assert "F(DATUM_C) = FEAT/POINT" in content
    assert "D(DRF_OP10) = DATSET/DAT(A)" in content

    # OP10 Kritik Ölçüleri
    assert "T(T_LEN_395_5) = TOL/DIST, NOMINL, 395.5000" in content
    assert "T(T_DIST_305_2) = TOL/DIST, NOMINL, 305.2000" in content
    assert "T(T_WIDTH_35) = TOL/DIST, NOMINL, 35.0000" in content
    assert "T(T_PROF_TOP) = TOL/PROFS, 0.5000" in content
    assert "T(T_SPACING_36_5) = TOL/DIST, NOMINL, 36.5000" in content
    assert "T(T_DIA_3_5) = TOL/DIAM, 3.5000" in content
    assert "T(T_DIA_43) = TOL/DIAM, 43.0000" in content
    assert "T(T_DIA_21) = TOL/DIAM, 21.0000" in content
    assert "T(T_STEP_12) = TOL/DIST, NOMINL, 12.0000" in content

    # OP20 Bölümü (180 derece ters çevirme ve derin dayama)
    assert "BAGLAMA 2 (OP20)" in content
    assert "180 DERECE TERS CEVIR" in content
    assert "T(T_RECESS_9_11) = TOL/DIST, NOMINL, 9.1100" in content
    assert "STATUS: CERTIFIED_COLLISION_FREE (OP10 / OP20 2-SETUP PASS)" in content
