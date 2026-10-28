#!/usr/bin/env python3
"""
Optimiza fotos para la galería del dojo.

Uso:
    python3 tools/optimizar-imagenes.py CARPETA_CON_FOTOS

- Lee .jpg, .jpeg, .png y .webp de la carpeta indicada.
- Reduce cada foto a un máximo de 1600 px de ancho y la guarda como .webp en src/assets/img/galeria/.
- Imprime las entradas listas para pegar en src/data/galeria.json (completa el texto "alt" de cada foto).

Requiere Pillow (pip install pillow). Es una herramienta opcional: el sitio no la necesita para funcionar.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

MAX_W = 1600
RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "src" / "assets" / "img" / "galeria"


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1
    origen = Path(sys.argv[1])
    if not origen.is_dir():
        print(f"No existe la carpeta: {origen}")
        return 1
    DESTINO.mkdir(parents=True, exist_ok=True)
    entradas = []
    for f in sorted(origen.iterdir()):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        nombre = f.stem.lower().replace(" ", "-") + ".webp"
        im.save(DESTINO / nombre, "WEBP", quality=80, method=6)
        entradas.append({"src": nombre, "alt": "DESCRIBE LA FOTO", "caption": "", "w": im.width, "h": im.height})
        print(f"✔ {f.name} → {nombre} ({im.width}×{im.height})")
    print("\nPega esto dentro de \"fotos\" en src/data/galeria.json y luego ejecuta: node build.mjs\n")
    print(json.dumps(entradas, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
