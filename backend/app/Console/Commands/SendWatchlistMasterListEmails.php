<?php

namespace App\Console\Commands;

use App\Mail\WatchlistMasterList;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendWatchlistMasterListEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:watchlist-master-list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send each user a weekly reminder of their watchlist';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::whereHas('watchlists')
            ->with(['watchlists.media'])
            ->get();

        $this->info("Sending watchlist reminders to {$users->count()} user(s).");

        foreach ($users as $user) {
            Mail::to($user->email)->send(new WatchlistMasterList($user, $user->watchlists));
            $this->info("Sent watchlist reminder to {$user->email}");
        }

        return Command::SUCCESS;
    }
}
