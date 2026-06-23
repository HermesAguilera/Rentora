<?php

namespace App\Http\Requests\Space;

use Illuminate\Foundation\Http\FormRequest;

class ReorderPhotosRequest extends FormRequest
{
    public function authorize(): bool
    {
        $space = $this->route('space');
        return $this->user()->can('update', $space);
    }

    public function rules(): array
    {
        return [
            'photo_uuids' => ['required', 'array'],
            'photo_uuids.*' => ['required', 'uuid', 'exists:space_photos,uuid'],
        ];
    }
}
