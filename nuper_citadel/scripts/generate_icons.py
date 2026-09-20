import os
from PIL import Image, ImageDraw

def generate_citadel_icons():
    icon_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src-tauri", "icons")
    os.makedirs(icon_dir, exist_ok=True)

    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded shield
    # Palette: Dark Slate Blue #0f172a, Cyber Amber #f59e0b, Aerospace Cyan #06b6d4, Emerald #10b981
    # Outer circle / ring
    center = size // 2
    radius = 230
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(15, 23, 42, 255),
        outline=(6, 182, 212, 255),
        width=10
    )

    # Tactical inner ring
    inner_radius = 200
    draw.ellipse(
        [center - inner_radius, center - inner_radius, center + inner_radius, center + inner_radius],
        fill=(30, 41, 59, 255),
        outline=(245, 158, 11, 220),
        width=4
    )

    # Fortress / Citadel Shield polygon
    shield_pts = [
        (256, 110),
        (370, 160),
        (370, 290),
        (256, 400),
        (142, 290),
        (142, 160)
    ]
    draw.polygon(shield_pts, fill=(15, 23, 42, 255), outline=(16, 185, 129, 255), width=6)

    # Inner citadel ramparts / battlements
    ramparts = [
        (200, 240), (200, 200), (220, 200), (220, 220),
        (245, 220), (245, 190), (267, 190), (267, 220),
        (292, 220), (292, 200), (312, 200), (312, 240),
        (256, 350)
    ]
    draw.polygon(ramparts, fill=(6, 182, 212, 200), outline=(245, 158, 11, 255), width=4)

    # Crosshair tactical marks
    draw.line([(center, 60), (center, 100)], fill=(6, 182, 212, 255), width=4)
    draw.line([(center, 412), (center, 452)], fill=(6, 182, 212, 255), width=4)
    draw.line([(60, center), (100, center)], fill=(6, 182, 212, 255), width=4)
    draw.line([(412, center), (452, center)], fill=(6, 182, 212, 255), width=4)

    # Save 512x512
    icon_512_path = os.path.join(icon_dir, "icon.png")
    img.save(icon_512_path, format="PNG")
    print(f"Saved: {icon_512_path}")

    # Save 128x128
    icon_128 = img.resize((128, 128), Image.Resampling.LANCZOS)
    icon_128_path = os.path.join(icon_dir, "128x128.png")
    icon_128.save(icon_128_path, format="PNG")
    print(f"Saved: {icon_128_path}")

    # Save 32x32
    icon_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32_path = os.path.join(icon_dir, "32x32.png")
    icon_32.save(icon_32_path, format="PNG")
    print(f"Saved: {icon_32_path}")

    # Save ICO containing multiple sizes
    ico_path = os.path.join(icon_dir, "icon.ico")
    img.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Saved: {ico_path}")

if __name__ == "__main__":
    generate_citadel_icons()
