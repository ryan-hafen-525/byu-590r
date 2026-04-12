<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class WatchlistMasterList extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $watchlistItems;

    public function __construct(User $user, Collection $watchlistItems)
    {
        $this->user = $user;
        $this->watchlistItems = $watchlistItems;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Weekly Watchlist Reminder',
        );
    }

    public function content(): Content
    {
        $base_url = env('APP_URL', 'http://127.0.0.1:8000');
        if (env('APP_ENV') === 'local') {
            $base_url = 'http://127.0.0.1:8000';
        }
        return new Content(
            view: 'mail.watchlist-master-list',
            with: [
                'base_url' => $base_url,
                'user' => $this->user,
                'watchlistItems' => $this->watchlistItems,
            ]
        );
    }
}
