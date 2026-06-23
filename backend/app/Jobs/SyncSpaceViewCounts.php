<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class SyncSpaceViewCounts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $keys = Redis::keys('space:*:views');
        
        if (empty($keys)) {
            return;
        }

        $updates = [];
        foreach ($keys as $key) {
            // key format: space:uuid:views
            $parts = explode(':', $key);
            $uuid = $parts[1] ?? null;
            
            if ($uuid) {
                $count = (int) Redis::get($key);
                if ($count > 0) {
                    $updates[] = [
                        'uuid' => $uuid,
                        'view_count' => $count,
                    ];
                }
            }
        }

        if (empty($updates)) {
            return;
        }

        DB::transaction(function () use ($updates, $keys) {
            // Batch update using raw query for efficiency
            $cases = [];
            $uuids = [];
            $bindings = [];

            foreach ($updates as $update) {
                $cases[] = "WHEN uuid = ? THEN view_count + ?";
                $bindings[] = $update['uuid'];
                $bindings[] = $update['view_count'];
                $uuids[] = $update['uuid'];
            }

            $casesSql = implode(' ', $cases);
            $uuidPlaceholders = implode(',', array_fill(0, count($uuids), '?'));
            $bindings = array_merge($bindings, $uuids);

            DB::update("
                UPDATE spaces 
                SET view_count = CASE {$casesSql} ELSE view_count END 
                WHERE uuid IN ({$uuidPlaceholders})
            ", $bindings);

            // Reset Redis counters
            foreach ($keys as $key) {
                Redis::del($key);
            }
        });
    }
}
