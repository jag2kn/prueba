<?php

namespace App\Http\Resources;

use App\Employee;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\EmployeeResource;

class EmployeeCollection extends ApiResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Transforms the collection to match format in EmployeeResource.
        $this->collection->transform(function (Employee $employee) {
            return (new EmployeeResource($employee));
        });

        return parent::toArray($request);
    }
}
