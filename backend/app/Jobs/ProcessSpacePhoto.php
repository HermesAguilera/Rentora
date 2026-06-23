<?php

namespace App\Jobs;

use App\Models\SpacePhoto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProcessSpacePhoto implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public SpacePhoto $photo)
    {
        $this->onQueue('photos');
    }

    public function uniqueId(): string
    {
        return $this->photo->id;
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->photo->id)];
    }

    public function handle(): void
    {
        try {
            $manager = new ImageManager(new Driver());
            $originalPath = $this->photo->original_path;
            
            if (!Storage::disk('local')->exists($originalPath)) {
                throw new \Exception("Original file not found.");
            }

            $image = $manager->read(Storage::disk('local')->get($originalPath));
            
            $spaceUuid = $this->photo->space->uuid;
            $photoUuid = $this->photo->uuid;
            $basePath = "spaces/{$spaceUuid}/photos/{$photoUuid}";

            // Process sizes
            $sizes = [
                'large' => [1200, 800],
                'medium' => [800, 533],
                'thumbnail' => [300, 200],
            ];

            $paths = [];

            foreach ($sizes as $size => [$width, $height]) {
                $resized = clone $image;
                $resized->cover($width, $height);
                $encoded = $resized->toWebp(90);
                
                $path = "{$basePath}/{$size}.webp";
                Storage::disk('s3')->put($path, $encoded->toString());
                $paths["{$size}_path"] = $path;
            }

            $this->photo->update(array_merge($paths, ['processing' => false]));

            // Cleanup local original
            Storage::disk('local')->delete($originalPath);
            
        } catch (\Throwable $th) {
            if ($this->attempts() >= $this->tries) {
                $this->photo->update(['failed' => true, 'processing' => false]);
            }
            throw $th;
        }
    }
}
