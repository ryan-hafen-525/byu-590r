<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Disable FK checks so we can drop tables that may be referenced by others
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('books');
        Schema::dropIfExists('author_phones');
        Schema::dropIfExists('phones');
        Schema::dropIfExists('authors');
        Schema::dropIfExists('movies');
        Schema::dropIfExists('genres');
        Schema::enableForeignKeyConstraints();

        // Media supertype
        Schema::create('media', function (Blueprint $table) {
            $table->id('media_id');
            $table->string('title');
            $table->text('synopsis')->nullable();
            $table->string('poster_url')->nullable();
            $table->enum('media_type', ['movie', 'tv_show']);
            $table->timestamps();
            $table->softDeletes();
        });

        // Movies (subtype)
        Schema::create('movies', function (Blueprint $table) {
            $table->id('movie_id');
            $table->foreignId('media_id')->constrained('media', 'media_id')->onDelete('cascade');
            $table->date('release_date')->nullable();
            $table->integer('runtime_minutes')->nullable();
            $table->timestamps();
        });

        // Genres
        Schema::create('genres', function (Blueprint $table) {
            $table->id('genre_id');
            $table->string('genre_name')->unique();
            $table->timestamps();
        });

        // Media-Genre pivot
        Schema::create('media_genre', function (Blueprint $table) {
            $table->foreignId('media_id')->constrained('media', 'media_id')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres', 'genre_id')->onDelete('cascade');
            $table->primary(['media_id', 'genre_id']);
        });

        // Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('review_id');
            $table->foreignId('media_id')->constrained('media', 'media_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned();
            $table->text('review_text')->nullable();
            $table->timestamps();
            $table->unique(['media_id', 'user_id']);
        });

        // Watchlists
        Schema::create('watchlists', function (Blueprint $table) {
            $table->id('watchlist_id');
            $table->foreignId('media_id')->constrained('media', 'media_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('added_at')->useCurrent();
            $table->unique(['media_id', 'user_id']);
        });

        // Seasons
        Schema::create('seasons', function (Blueprint $table) {
            $table->id('season_id');
            $table->foreignId('media_id')->constrained('media', 'media_id')->onDelete('cascade');
            $table->integer('season_number');
            $table->timestamps();
            $table->unique(['media_id', 'season_number']);
        });

        // Episodes
        Schema::create('episodes', function (Blueprint $table) {
            $table->id('episode_id');
            $table->foreignId('season_id')->constrained('seasons', 'season_id')->onDelete('cascade');
            $table->integer('episode_number');
            $table->string('title');
            $table->integer('runtime_minutes')->nullable();
            $table->timestamps();
            $table->unique(['season_id', 'episode_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('episodes');
        Schema::dropIfExists('seasons');
        Schema::dropIfExists('watchlists');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('media_genre');
        Schema::dropIfExists('genres');
        Schema::dropIfExists('movies');
        Schema::dropIfExists('media');
    }
};
