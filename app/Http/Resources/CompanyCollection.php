<?php

namespace App\Http\Resources;

use App\Company;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\CompanyResource;

class CompanyCollection extends ApiResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Transforms the collection to match format in CompanyResource.
        $this->collection->transform(function (Company $company) {
            return (new CompanyResource($company));
        });

        return parent::toArray($request);
    }
}
