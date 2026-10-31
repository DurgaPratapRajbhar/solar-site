"""
gallery table — real install photos + videos ("Humara Kaam").

Seed items (files already in frontend/public/uploads) are added when missing, so a
fresh database shows the work straight away. Admin add/delete is the source of truth after that.
"""

from db import execute, fetch_all, fetch_one

SEED = [
    ("image", "/uploads/chhat-install.jpg", None, "🏠 Chhat pe panel array — install complete"),
    ("image", "/uploads/bada-array.jpg", None, "⚡ Bada array — fitting ke waqt"),
    ("image", "/uploads/structure-kaam.jpg", None, "👷 Structure ka kaam — hum khud lagate hain"),
    ("image", "/uploads/dukaan.jpg", None, "🏪 Hamari dukaan — panel, light, sab stock me"),
    ("video", "/uploads/kaam-video.mp4", "/uploads/kaam-poster.jpg", "▶ Kaam chalte hue — live video"),
    ("video", "/uploads/vid-panel-array.mp4", "/uploads/vid-panel-array-poster.jpg", "Poora panel array — roof se view"),
    ("video", "/uploads/vid-panel-angle.mp4", "/uploads/vid-panel-angle-poster.jpg", "Panel angle set karte hue"),
    ("video", "/uploads/vid-structure-start.mp4", "/uploads/vid-structure-start-poster.jpg", "Structure lagana — kaam shuru se"),
    ("video", "/uploads/vid-panels-ready.mp4", "/uploads/vid-panels-ready-poster.jpg", "Panels ready — fitting complete"),
    ("video", "/uploads/vid-inverter-setup.mp4", "/uploads/vid-inverter-setup-poster.jpg", "Inverter ka asli setup — battery aur display"),
    ("video", "/uploads/vid-team-work.mp4", "/uploads/vid-team-work-poster.jpg", "Team chhat pe kaam karte hue"),
    ("video", "/uploads/vid-farm-site.mp4", "/uploads/vid-farm-site-poster.jpg", "Structure ka kaam — khet/dukaan ke paas"),
    ("video", "/uploads/vid-final-fitting.mp4", "/uploads/vid-final-fitting-poster.jpg", "Aakhri fitting touch"),
]


def add_missing_seed() -> None:
    have = {row["url"] for row in fetch_all("SELECT url FROM gallery")}
    for index, (media_type, url, poster, caption) in enumerate(SEED):
        if url not in have:
            execute(
                "INSERT INTO gallery (media_type, url, poster, caption, sort_order) VALUES (%s, %s, %s, %s, %s)",
                (media_type, url, poster, caption, len(SEED) - index),
            )


def list_items() -> list[dict]:
    return fetch_all("SELECT * FROM gallery ORDER BY sort_order DESC, id DESC")


# New items go to the top
def add(media_type: str, url: str, poster: str | None, caption: str) -> None:
    row = fetch_one("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM gallery")
    execute(
        "INSERT INTO gallery (media_type, url, poster, caption, sort_order) VALUES (%s, %s, %s, %s, %s)",
        (media_type, url, poster or None, caption, row["next"]),
    )


def delete(item_id: int) -> bool:
    return execute("DELETE FROM gallery WHERE id = %s", (item_id,)) > 0
