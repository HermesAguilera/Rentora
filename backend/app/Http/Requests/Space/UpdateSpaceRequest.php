<?php

namespace App\Http\Requests\Space;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Space;

class UpdateSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $space = $this->route('space');
        return $this->user()->can('update', $space);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:50'],
            'address' => ['sometimes', 'string', 'max:255'],
            'price_per_month' => ['sometimes', 'numeric', 'min:0'],
            'city' => ['sometimes', 'string', 'max:100'],
            'neighborhood' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string'],
        ];
    }
}
