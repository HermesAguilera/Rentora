<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Exception;

class HealthCheck extends Command
{
    protected $signature = 'app:health-check';
    protected $description = 'Verify application health (DB, Redis, Storage, Mail, Queue, Env)';

    public function handle()
    {
        $this->info('Starting Health Check...');

        // 1. DB
        try {
            DB::connection()->getPdo();
            $this->info('[OK] Database connection');
        } catch (Exception $e) {
            $this->error('[FAIL] Database connection: ' . $e->getMessage());
        }

        // 2. Redis
        try {
            Redis::ping();
            $this->info('[OK] Redis connection');
        } catch (Exception $e) {
            $this->error('[FAIL] Redis connection: ' . $e->getMessage());
        }

        // 3. Storage
        try {
            Storage::disk('local')->put('health.txt', 'ok');
            Storage::disk('local')->delete('health.txt');
            $this->info('[OK] Local storage writable');
        } catch (Exception $e) {
            $this->error('[FAIL] Local storage: ' . $e->getMessage());
        }

        // 4. Queue (Basic check, assume running if Redis is fine or check specific key)
        try {
            $heartbeat = Redis::get('queue_heartbeat');
            if ($heartbeat && (time() - $heartbeat) < 300) {
                $this->info('[OK] Queue worker seems alive (heartbeat)');
            } else {
                $this->warn('[WARN] Queue heartbeat missing or stale. Worker may be down.');
            }
        } catch (Exception $e) {
            $this->error('[FAIL] Queue check: ' . $e->getMessage());
        }

        // 5. Env
        $requiredEnvs = ['APP_KEY', 'DB_PASSWORD', 'MAIL_MAILER'];
        foreach ($requiredEnvs as $env) {
            if (empty(env($env))) {
                $this->error("[FAIL] Missing ENV: {$env}");
            } else {
                $this->info("[OK] ENV configured: {$env}");
            }
        }

        $this->info('Health check completed.');
    }
}
