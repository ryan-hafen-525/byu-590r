<?php

use App\Http\Controllers\Api\HelloWorldController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WatchlistController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\EpisodeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Hello World API routes
Route::get('/hello', [HelloWorldController::class, 'hello']);
Route::get('/health', [HelloWorldController::class, 'health']);
Route::get('/test-s3', [HelloWorldController::class, 'testS3']);

// Authentication routes
Route::controller(RegisterController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('logout', 'logout');
    Route::post('forgot_password', 'forgotPassword');
    Route::get('password_reset', 'passwordReset');
    Route::get('verify_email', 'verifyEmail');
});

// Protected routes
Route::middleware(\App\Http\Middleware\AuthenticateApi::class)->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('user', 'getUser');
        Route::post('user/upload_avatar', 'uploadAvatar');
        Route::delete('user/remove_avatar', 'removeAvatar');
        Route::post('user/send_verification_email', 'sendVerificationEmail');
        Route::post('user/change_email', 'changeEmail');
    });

    // Genres (read-only)
    Route::get('genres', [GenreController::class, 'index']);

    // Media CRUD
    Route::post('media/generate-synopsis', [MediaController::class, 'generateSynopsis']);
    Route::get('media', [MediaController::class, 'index']);
    Route::get('media/{id}', [MediaController::class, 'show']);
    Route::post('media', [MediaController::class, 'store']);
    Route::put('media/{id}', [MediaController::class, 'update']);
    Route::post('media/{id}', [MediaController::class, 'update']);
    Route::delete('media/{id}', [MediaController::class, 'destroy']);

    // Reviews (nested under media)
    Route::get('media/{media}/reviews', [ReviewController::class, 'index']);
    Route::post('media/{media}/reviews', [ReviewController::class, 'store']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

    // Watchlist
    Route::get('watchlist', [WatchlistController::class, 'index']);
    Route::post('watchlist', [WatchlistController::class, 'store']);
    Route::delete('watchlist/{id}', [WatchlistController::class, 'destroy']);

    // Seasons (nested under media)
    Route::get('media/{media}/seasons', [SeasonController::class, 'index']);
    Route::post('media/{media}/seasons', [SeasonController::class, 'store']);
    Route::put('seasons/{season}', [SeasonController::class, 'update']);
    Route::delete('seasons/{season}', [SeasonController::class, 'destroy']);

    // Episodes (nested under seasons)
    Route::get('seasons/{season}/episodes', [EpisodeController::class, 'index']);
    Route::post('seasons/{season}/episodes', [EpisodeController::class, 'store']);
    Route::put('episodes/{episode}', [EpisodeController::class, 'update']);
    Route::delete('episodes/{episode}', [EpisodeController::class, 'destroy']);
});
