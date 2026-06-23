<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;

class AdminActionObserver
{
    // A simplified generic observer or specific models observer to log admin actions
    // Since we need to log admin actions, we can just log whenever certain models are updated by admin.
    // For a specific solution, we can log in the controllers directly or use an Event subscriber.
    // Assuming we observe Space and User for admin changes:
    
    public function updated($model)
    {
        if (request()->user() && request()->user()->role->value === 'admin') {
            Log::channel('admin_audit')->info('Admin action performed', [
                'admin_uuid' => request()->user()->uuid,
                'action' => 'updated',
                'model' => get_class($model),
                'model_id' => $model->id,
                'changes' => $model->getChanges(),
                'ip' => request()->ip(),
            ]);
        }
    }
}
