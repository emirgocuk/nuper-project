import os
from build123d import *

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")
os.makedirs(FIXTURES_DIR, exist_ok=True)
STEP_PATH = os.path.join(FIXTURES_DIR, "sample_bracket.step")


def generate_bracket():
    with BuildPart() as bracket:
        # 1. Taban Plakası: 120 x 85 x 10 mm
        Box(120, 85, 10)

        # 2. Dik Flanş / Feder: 10 x 85 x 35 mm (Z=10'dan yukarıya)
        with Locations((55, 0, 22.5)):
            Box(10, 85, 35)

        # 3. 4 Adet M4 Montaj Deliği (D=4.2 mm)
        hole_locations = [
            (-45, -27.5, 0),
            (45, -27.5, 0),
            (45, 27.5, 0),
            (-45, 27.5, 0),
        ]
        with Locations(hole_locations):
            Hole(radius=2.1, depth=10)

    # STEP dosyasına aktar
    export_step(bracket.part, STEP_PATH)
    print(f"Sample defense bracket STEP file created at: {STEP_PATH}")


if __name__ == "__main__":
    generate_bracket()
