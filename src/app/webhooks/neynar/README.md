# Neynar Webhooks

## Payloads

### `cast.created` Example

<img width="687" alt="image" src="https://github.com/eucalyptus-viminalis/interframe/assets/65995595/2ac68820-be14-439e-8859-9cb946ca64e7">

#### @reveal

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

#### @reveal w/ embedded share link

```json
{
    "created_at": 1708655363,
    "type": "cast.created",
    "data": {
        "object": "cast",
        "hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
        "thread_hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
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
        "text": "https://zora.co/collect/zora:0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf/17?referrer=0xea990ae72939B8751cB680919C6B64A05B8e1451\n\nzora mint share link\n\n@reveal",
        "timestamp": "2024-02-23T02:29:18.000Z",
        "embeds": [
            {
                "url": "https://zora.co/collect/zora:0x67805fba9dffb9ae89ce1ba8acd5414253b85bdf/17?referrer=0xea990ae72939B8751cB680919C6B64A05B8e1451"
            }
        ],
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

#### @reveal reply to cast w/ embedded share link

```json
{
    "created_at": 1708655387,
    "type": "cast.created",
    "data": {
        "object": "cast",
        "hash": "0x2d48ceaa4eb988fa59933fb47df0cd02e030d74e",
        "thread_hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
        "parent_hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
        "parent_url": null,
        "root_parent_url": "https://warpcast.com/~/channel/xxxx",
        "parent_author": { "fid": "13642" },
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
        "text": "@reveal reply to zora mint share link embedded cast",
        "timestamp": "2024-02-23T02:29:43.000Z",
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

#### @reveal replying to quote casted, recasted, liked cast

```json
{
    "created_at": 1708656961,
    "type": "cast.created",
    "data": {
        "object": "cast",
        "hash": "0xf9af25d4188c2d148156534d0e2e6cf4a82e87ce",
        "thread_hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
        "parent_hash": "0x9d9023b837d5f1ec03e4842187497a90ff1184f8",
        "parent_url": null,
        "root_parent_url": "https://warpcast.com/~/channel/xxxx",
        "parent_author": { "fid": "13642" },
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
            "follower_count": 828,
            "following_count": 450,
            "verifications": [
                "0xea990ae72939b8751cb680919c6b64a05b8e1451",
                "0xb5009ac90f0c90cd6de17763e394606ebea2697e619ff4ebb7da7a3ee53458fc"
            ],
            "active_status": "active"
        },
        "text": "@reveal replying to liked, quote casted, recasted",
        "timestamp": "2024-02-23T02:55:57.000Z",
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
