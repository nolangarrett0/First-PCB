"""Regenerate the Windows icon with Pillow. The generated ICO is committed."""

from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
output = root / "build"
output.mkdir(exist_ok=True)

size = 512
image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((16, 16, 496, 496), radius=112, fill="#164E3B")
draw.rounded_rectangle((35, 35, 477, 477), radius=96, outline="#3D8869", width=12)

mint = "#C8F4D5"
for point in (180, 230, 280, 330):
    draw.line((point, 130, point, 174), fill=mint, width=17)
    draw.line((point, 338, point, 382), fill=mint, width=17)
    draw.line((130, point, 174, point), fill=mint, width=17)
    draw.line((338, point, 382, point), fill=mint, width=17)

draw.rounded_rectangle((170, 170, 342, 342), radius=26, outline=mint, width=21)
draw.line((208, 256, 235, 283, 300, 218), fill=mint, width=20, joint="curve")
draw.ellipse((365, 94, 427, 156), fill="#F8C849", outline="#FCEEA4", width=9)

image.save(output / "icon.png")
image.save(output / "icon.ico", format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
