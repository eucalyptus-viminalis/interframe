# Neynar Webhooks

## Payloads

### Example

```json
{
    "created_at": 1708654751,
    "type": "cast.created",
    "data": {
        "object": "cast",
        "hash": "0x8c5a53c05f7decb0712e1e6ef5db81c0fe38d526",
        "thread_hash": "0x8c5a53c05f7decb0712e1e6ef5db81c0fe38d526",
        "parent_hash": null,
        "parent_url": "https://warpcast.com/~/channel/xxxx",
        "root_parent_url": "https://warpcast.com/~/channel/xxxx",
        "parent_author": { "fid": null },
        "author": {
            "object": "user",
            "fid": 13642,
            "custody_address": "0x859f83fab3c1bbd44ab27ee3263f70685bc8429b",
            "username": "3070",
            "display_name": "3070 🎩-'",
            "pfp_url": "https://i.imgur.com/P0UVr7h.gif",
            "profile": {
                "bio": { "text": "just looking", "mentioned_profiles": [] }
            },
            "follower_count": 827,
            "following_count": 450,
            "verifications": [
                "0xea990ae72939b8751cb680919c6b64a05b8e1451",
                "0xb5009ac90f0c90cd6de17763e394606ebea2697e619ff4ebb7da7a3ee53458fc"
            ],
            "active_status": "active"
        },
        "text": "@reveal",
        "timestamp": "2024-02-23T02:19:06.000Z",
        "embeds": [],
        "reactions": { "likes": [], "recasts": [] },
        "replies": { "count": 0 },
        "mentioned_profiles": [
            {
                "object": "user",
                "fid": 360089,
                "custody_address": "0xa15f11f1c48a89506baf063b02a93b4b150b87cb",
                "username": "reveal",
                "display_name": "reveal",
                "pfp_url": "https://i.imgur.com/XTGEHBz.jpg",
                "profile": {
                    "bio": { "text": "I am a b/o/t", "mentioned_profiles": [] }
                },
                "follower_count": 10,
                "following_count": 74,
                "verifications": [],
                "active_status": "inactive"
            }
        ]
    }
}
```
