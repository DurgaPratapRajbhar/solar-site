"""
Solar API — the only service that talks to Postgres.

  GET    /gallery              → all photos/videos (homepage + gallery page)
  POST   /admin/gallery        → add an item: photo/video file, or a YouTube/Instagram/Facebook link (X-Admin-Token)
  DELETE /admin/gallery/{id}   → remove an item     (X-Admin-Token)

The Next.js site checks the admin login cookie and forwards ADMIN_TOKEN.

Run it:
  pip install -r requirements.txt
  uvicorn main:app --port 8002
"""

import os
import secrets
from typing import Literal
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field, model_validator

import db
import gallery

if db.init_db():
    gallery.add_missing_seed()

app = FastAPI(title="Solar API")


def require_admin(x_admin_token: str = Header(default="")):
    expected = os.getenv("ADMIN_TOKEN", "")
    if not expected or not secrets.compare_digest(x_admin_token, expected):
        raise HTTPException(status_code=401, detail="Not allowed")


admin = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])


# A social post must be a link to that site, so the page only ever embeds these sites
SOCIAL_HOSTS = {
    "youtube": ("youtube.com", "youtu.be"),
    "instagram": ("instagram.com",),
    "facebook": ("facebook.com", "fb.watch"),
}


class GalleryItemIn(BaseModel):
    media_type: Literal["image", "video", "youtube", "instagram", "facebook"] = "image"
    url: str = Field(min_length=1, max_length=500)
    poster: str | None = Field(default=None, max_length=500)
    caption: str = Field(default="", max_length=200)

    @model_validator(mode="after")
    def social_link_matches_site(self):
        hosts = SOCIAL_HOSTS.get(self.media_type)
        if hosts:
            link = urlparse(self.url)
            host = (link.hostname or "").removeprefix("www.").removeprefix("m.")
            if link.scheme != "https" or not any(host == h or host.endswith("." + h) for h in hosts):
                raise ValueError(f"{self.media_type} ka sahi https link chahiye")
        return self


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/gallery")
def list_gallery():
    return gallery.list_items()


@admin.post("/gallery", status_code=201)
def add_gallery_item(item: GalleryItemIn):
    gallery.add(item.media_type, item.url, item.poster, item.caption)
    return {"ok": True}


@admin.delete("/gallery/{item_id}", status_code=204)
def delete_gallery_item(item_id: int):
    if not gallery.delete(item_id):
        raise HTTPException(status_code=404, detail="Not found")


app.include_router(admin)
