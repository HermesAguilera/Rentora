<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'space_uuid' => ['required', 'string', 'exists:spaces,uuid'],
            'start_date' => ['required', 'date', 'after:today'],
            'months_duration' => ['required', 'integer', 'min:1', 'max:24'],
        ];
    }
}
