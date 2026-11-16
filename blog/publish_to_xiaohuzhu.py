#!/usr/bin/env python3
"""
One-command WordPress.com publisher for xiaohuzhu.xyz (Site ID: 155616057).

Supports two official WordPress.com authentication modes:
  1. Application Password via XML-RPC (https://xiaohuzhu.xyz/xmlrpc.php):
       export WP_USERNAME="your_wpcom_username_or_email"
       export WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
       python3 blog/publish_to_xiaohuzhu.py --publish

  2. WordPress.com OAuth2 Bearer Token via REST API:
       export WPCOM_ACCESS_TOKEN="your_oauth_token"
       python3 blog/publish_to_xiaohuzhu.py --publish

Use --draft to upload and create as a private reviewable draft first.
"""

import argparse
import json
import mimetypes
import os
import pathlib
import sys
import urllib.request
import xmlrpc.client

SITE_ID = 155616057
XMLRPC_URL = "https://xiaohuzhu.xyz/xmlrpc.php"
WPCOM_REST_BASE = f"https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}"

POST_TITLE = "智觉（Noetic Sense）：人机共生时代的认知义体与超级智能直觉界面"
POST_SLUG = "noetic-sense-cognitive-prosthesis-human-asi-symbiosis"
POST_EXCERPT = (
    "将超级智能（ASI）高维、隐性的运算与意图折叠为人类前语言直觉的认知义体设计："
    "四维通感架构、双向共情过载降维、Three.js WebGPU + TSL 动态流形原型与“留白与敬畏”的终极伦理。"
)
CATEGORIES = ["AGI", "AI Safety", "Alignment", "Beneficial", "Intelligence"]
TAGS = [
    "Noetic Sense",
    "Superintelligence",
    "Cognitive Prosthesis",
    "AI Alignment",
    "WebGPU",
    "Three.js",
]

HERE = pathlib.Path(__file__).resolve().parent
HTML_PATH = HERE / "wordpress_post.html"
COVER_PATH = HERE / "noetic-sense-cover.png"


def publish_via_xmlrpc(username: str, app_password: str, post_status: str) -> str:
    server = xmlrpc.client.ServerProxy(XMLRPC_URL)
    html_body = HTML_PATH.read_text(encoding="utf-8")

    thumbnail_id = None
    if COVER_PATH.exists():
        print(f"[1/2] Uploading featured cover image ({COVER_PATH.name}) to xiaohuzhu.xyz...")
        media_data = {
            "name": "noetic-sense-webgpu-manifold.png",
            "type": mimetypes.guess_type(str(COVER_PATH))[0] or "image/png",
            "bits": xmlrpc.client.Binary(COVER_PATH.read_bytes()),
            "overwrite": False,
        }
        upload_res = server.wp.uploadFile(1, username, app_password, media_data)
        thumbnail_id = upload_res.get("id")
        img_url = upload_res.get("url")
        if img_url:
            hero_block = (
                f'<!-- wp:image {{"sizeSlug":"large"}} -->\n'
                f'<figure class="wp-block-image size-large">'
                f'<img src="{img_url}" alt="智觉 · Noetic Sense — Three.js WebGPU &amp; TSL Manifold" />'
                f'<figcaption class="wp-element-caption">智觉（Noetic Sense）：基于 Three.js WebGPU 与 TSL 计算着色器实时演化的主权心智薄膜与 4,096 颗因果孢子流形。</figcaption>'
                f"</figure>\n<!-- /wp:image -->\n\n"
            )
            html_body = hero_block + html_body

    print(f"[2/2] Creating post on xiaohuzhu.xyz (status={post_status})...")
    content_struct = {
        "post_type": "post",
        "post_status": post_status,
        "post_title": POST_TITLE,
        "post_name": POST_SLUG,
        "post_excerpt": POST_EXCERPT,
        "post_content": html_body,
        "terms_names": {
            "category": CATEGORIES,
            "post_tag": TAGS,
        },
    }
    if thumbnail_id:
        content_struct["post_thumbnail"] = thumbnail_id

    post_id = server.wp.newPost(1, username, app_password, content_struct)
    post_info = server.wp.getPost(1, username, app_password, post_id, ["link", "status"])
    return post_info.get("link", f"https://xiaohuzhu.xyz/?p={post_id}")


def publish_via_oauth(token: str, post_status: str) -> str:
    html_body = HTML_PATH.read_text(encoding="utf-8")
    payload = json.dumps(
        {
            "title": POST_TITLE,
            "slug": POST_SLUG,
            "excerpt": POST_EXCERPT,
            "content": html_body,
            "status": post_status,
            "categories": CATEGORIES,
            "tags": TAGS,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        f"{WPCOM_REST_BASE}/posts/new",
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=utf-8",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data.get("URL") or data.get("short_URL")


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish Noetic Sense essay to xiaohuzhu.xyz")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--publish", action="store_true", help="Publish live immediately (default)")
    group.add_argument("--draft", action="store_true", help="Save as draft on xiaohuzhu.xyz")
    args = parser.parse_args()

    status = "draft" if args.draft else "publish"

    oauth_token = os.environ.get("WPCOM_ACCESS_TOKEN", "").strip()
    wp_user = os.environ.get("WP_USERNAME", "").strip()
    wp_app_pw = os.environ.get("WP_APP_PASSWORD", "").strip()

    if wp_user and wp_app_pw:
        url = publish_via_xmlrpc(wp_user, wp_app_pw, status)
        print(f"SUCCESS: Post ({status}) available at: {url}")
        return 0

    if oauth_token:
        url = publish_via_oauth(oauth_token, status)
        print(f"SUCCESS: Post ({status}) available at: {url}")
        return 0

    print(
        "ERROR: Missing WordPress.com credentials.\n"
        "Set WP_USERNAME and WP_APP_PASSWORD (WordPress.com Application Password)\n"
        "or WPCOM_ACCESS_TOKEN, then re-run.",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
