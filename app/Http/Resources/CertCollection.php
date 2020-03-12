<?php

namespace App\Http\Resources;

use App\Cert;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\CertResource;

class CertCollection extends ApiResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Transforms the collection to match format in CertResource.
        $this->collection->transform(function (Cert $cert) {
            return (new CertResource($cert));
        });

        return parent::toArray($request);
    }
}
