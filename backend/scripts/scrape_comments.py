"""
Kratt -- YouTube Shorts comment scraper
=======================================
Pulls top-level comments from a list of YouTube Shorts using the
YouTube Data API v3 (commentThreads.list -- 1 quota unit per call,
so this is cheap even across thousands of comments).

INPUT:  videos_to_scrape.csv  with columns: url_or_id, niche_tag
        (paste full Shorts links OR bare video IDs -- either works,
        so Fiko/Richtjhie can just drop links in without extracting
        IDs by hand)

OUTPUT: raw_comments.csv with columns:
        comment_id, video_id, niche_tag, text, published_at, like_count, reply_count

video_id is kept in THIS raw file only so a later step can detect
copy-paste comments across videos. Drop it before building your
final (comment, label) training file -- this script does not touch
labels at all, that's a separate step.

SETUP:
  pip install google-api-python-client
  export YOUTUBE_API_KEY="your_key_here"
  (get a key at console.cloud.google.com -> enable "YouTube Data API v3"
  -> Credentials -> Create API Key)

RUN:
  python scrape_comments.py
"""

import csv
import os
import re
import time
from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

API_KEY = os.environ.get("YOUTUBE_API_KEY")
INPUT_FILE = "videos_to_scrape.csv"
OUTPUT_FILE = "raw_comments.csv"
FIELDNAMES = [
    "comment_id", "video_id", "niche_tag", "text",
    "published_at", "like_count", "reply_count",
]

VIDEO_ID_PATTERN = re.compile(r"(?:shorts/|v=|youtu\.be/)([A-Za-z0-9_-]{11})")


def extract_video_id(url_or_id: str) -> str:
    """Accepts a bare 11-char video ID or a full Shorts/watch/youtu.be URL."""
    url_or_id = url_or_id.strip()
    if len(url_or_id) == 11 and "/" not in url_or_id:
        return url_or_id
    match = VIDEO_ID_PATTERN.search(url_or_id)
    if match:
        return match.group(1)
    raise ValueError(f"Couldn't parse a video ID from: {url_or_id!r}")


def load_video_list(path):
    videos = []
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            videos.append({
                "video_id": extract_video_id(row["url_or_id"]),
                "niche_tag": row["niche_tag"].strip(),
            })
    return videos


def get_client():
    if not API_KEY:
        raise RuntimeError("Set YOUTUBE_API_KEY as an environment variable first.")
    return build("youtube", "v3", developerKey=API_KEY)


def fetch_comments_for_video(youtube, video_id, niche_tag):
    """Yield one dict per top-level comment, paginating until exhausted."""
    page_token = None
    while True:
        try:
            response = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                order="time",       # chronological -- avoids YouTube's own
                                     # "relevance" ranking skewing the sample
                                     # toward already-popular comments
                textFormat="plainText",
                pageToken=page_token,
            ).execute()
        except HttpError as e:
            content = e.content.decode("utf-8") if hasattr(e, "content") else str(e)
            if "commentsDisabled" in content:
                print(f"  [skip] comments disabled on {video_id}")
            else:
                print(f"  [error] {video_id}: {content[:200]}")
            return

        for item in response.get("items", []):
            top = item["snippet"]["topLevelComment"]
            snippet = top["snippet"]
            yield {
                "comment_id": top["id"],
                "video_id": video_id,
                "niche_tag": niche_tag,
                "text": snippet["textDisplay"],
                "published_at": snippet["publishedAt"],
                "like_count": snippet["likeCount"],
                "reply_count": item["snippet"]["totalReplyCount"],
            }

        page_token = response.get("nextPageToken")
        if not page_token:
            return
        time.sleep(0.1)  # polite pacing, not strictly required at 1 unit/call


def main():
    youtube = get_client()
    videos = load_video_list(INPUT_FILE)
    file_exists = Path(OUTPUT_FILE).exists()

    with open(OUTPUT_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()

        for video in videos:
            print(f"Scraping {video['video_id']} ({video['niche_tag']})...")
            count = 0
            for row in fetch_comments_for_video(youtube, video["video_id"], video["niche_tag"]):
                writer.writerow(row)
                count += 1
            print(f"  -> {count} comments saved")

    print(f"\nDone. Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
