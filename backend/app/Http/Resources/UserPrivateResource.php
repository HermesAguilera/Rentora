<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class UserPrivateResource extends UserResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status?->value,
            'email_verified_at' => $this->email_verified_at,
            'phone_verified_at' => $this->phone_verified_at,
            'identity_verified_at' => $this->identity_verified_at,
            'created_at' => $this->created_at,
            'metadata' => $this->metadata,
        ]);
    }
}
