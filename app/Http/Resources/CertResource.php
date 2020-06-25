<?php

namespace App\Http\Resources;

use App\Http\Resources\ApiResouce;
use App\Custom\Hasher;

class CertResource extends ApiResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => $this->user_id,
            'name' => $this->name,
            'document' => $this->document,
            'number' => $this->number,
            'course' => $this->course,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'city' => $this->city,
            'code' => $this->code,
            'status' => $this->status,
            'created_at' => (string)$this->created_at->toDateTimeString(),
            'updated_at' => (string)$this->updated_at->toDateTimeString(),
        ];
    }
}
