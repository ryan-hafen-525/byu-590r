<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Watchlist Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; color: #222;">
    <h1>Hi {{ $user->name }},</h1>
    <p>Here's a reminder of what's currently on your watchlist:</p>

    @forelse ($watchlistItems as $item)
        <div style="border-bottom: 1px solid #ddd; padding: 12px 0;">
            <h3 style="margin: 0 0 4px 0;">{{ $item->media->title }}</h3>
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #666; text-transform: uppercase;">
                {{ $item->media->media_type }}
            </p>
            @if ($item->media->synopsis)
                <p style="margin: 0;">{{ $item->media->synopsis }}</p>
            @endif
        </div>
    @empty
        <p>Your watchlist is empty.</p>
    @endforelse

    <p style="margin-top: 24px;">
        Visit <a href="{{ $base_url }}">your app</a> to keep watching.
    </p>
</body>
</html>
