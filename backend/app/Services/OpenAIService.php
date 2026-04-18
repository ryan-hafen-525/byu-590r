<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
    }

    /**
     * Generate a synopsis for a movie or TV show using OpenAI.
     */
    public function generateSynopsis(string $title, string $mediaType): string
    {
        $typeLabel = $mediaType === 'tv_show' ? 'TV show' : 'movie';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a helpful assistant that writes concise synopses for movies and TV shows. Write 2-3 sentences only. Do not include the title in your response.',
                ],
                [
                    'role' => 'user',
                    'content' => "Write a synopsis for the {$typeLabel} titled \"{$title}\".",
                ],
            ],
            'max_tokens' => 200,
            'temperature' => 0.7,
        ]);

        if ($response->failed()) {
            Log::error('OpenAI API error', ['status' => $response->status(), 'body' => $response->body()]);
            throw new \Exception('Failed to generate synopsis from OpenAI.');
        }

        return $response->json('choices.0.message.content', '');
    }

    /**
     * Check if OpenAI service is properly configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Get service status
     */
    public function getStatus(): array
    {
        return [
            'service' => 'OpenAI',
            'configured' => $this->isConfigured(),
            'base_url' => $this->baseUrl,
            'has_api_key' => !empty($this->apiKey)
        ];
    }
}