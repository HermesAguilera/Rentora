<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DisputeBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dispute_reason' => ['required', 'string', 'min:50'],
            'evidence' => ['nullable', 'array', 'max:3'],
            'evidence.*' => ['image', 'max:2048'],
        ];
    }
}
