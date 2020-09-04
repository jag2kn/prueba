<?php

namespace App\Http\Resources;

use App\Http\Resources\ApiResouce;
use App\Custom\Hasher;

class EmployeeResource extends ApiResource
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
            'company' => $this->company_id,
            'name' => $this->name,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => (string)$this->created_at->toDateTimeString(),
            'updated_at' => (string)$this->updated_at->toDateTimeString(),
        ];
    }
}
