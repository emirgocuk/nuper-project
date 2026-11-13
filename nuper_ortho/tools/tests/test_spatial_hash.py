import time
from tools.extractor.spatial import SpatialHashGrid, prune_hatching_lines


def test_spatial_hash_grid_10000_items_under_50ms() -> None:
    grid = SpatialHashGrid(cell_size=24.0)
    for idx in range(10000):
        col = idx % 100
        row = idx // 100
        x0 = float(col * 30)
        y0 = float(row * 30)
        grid.insert([x0, y0, x0 + 12.0, y0 + 8.0], {"id": idx, "x": x0, "y": y0})

    start_ns = time.perf_counter_ns()
    matches = grid.query_radius([450.0, 450.0, 462.0, 458.0], 35.0)
    elapsed_ms = (time.perf_counter_ns() - start_ns) / 1_000_000.0

    assert elapsed_ms < 50.0
    assert len(matches) > 0
    matched_ids = {m["id"] for m in matches}
    assert 1515 in matched_ids


def test_prune_hatching_lines_filters_45_and_135_degree_clusters() -> None:
    drawings = []
    for k in range(12):
        offset = float(k * 6.0)
        drawings.append({
            "rect": [100.0 + offset, 100.0, 120.0 + offset, 120.0],
            "items": [("l", (100.0 + offset, 100.0), (120.0 + offset, 120.0))],
        })
    for k in range(8):
        offset = float(k * 5.0)
        drawings.append({
            "rect": [300.0 + offset, 100.0, 320.0 + offset, 120.0],
            "items": [("l", (320.0 + offset, 100.0), (300.0 + offset, 120.0))],
        })

    drawings.append({
        "rect": [50.0, 50.0, 150.0, 50.0],
        "items": [("l", (50.0, 50.0), (150.0, 50.0))],
    })
    drawings.append({
        "rect": [50.0, 50.0, 50.0, 150.0],
        "items": [("l", (50.0, 50.0), (50.0, 150.0))],
    })
    drawings.append({
        "rect": [600.0, 600.0, 615.0, 615.0],
        "items": [("l", (600.0, 600.0), (615.0, 615.0))],
    })

    pruned = prune_hatching_lines(drawings, min_cluster_size=5)
    assert len(pruned) == 3
    hatching_count = sum(1 for d in drawings if d.get("is_hatching"))
    assert hatching_count == 20
