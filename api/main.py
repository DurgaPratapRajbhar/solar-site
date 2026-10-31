"""
Solar API — the only service that talks to Postgres.

  GET    /gallery              → all photos/videos (homepage + gallery page)
  POST   /admin/gallery        → add an item        (X-Admin-Token)
  DELETE /admin/gallery/{id}   → remove an item     (X-Admin-Token)

The Next.js site checks the admin login cookie and forwards ADMIN_TOKEN.

Run it:
  pip install -r requirements.txt
  uvicorn main:app --port 8002
"""

import os
import secrets
from typing import Literal

from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

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


class GalleryItemIn(BaseModel):
    media_type: Literal["image", "video"] = "image"
    url: str = Field(min_length=1, max_length=500)
    poster: str | None = Field(default=None, max_length=500)
    caption: str = Field(default="", max_length=200)


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
