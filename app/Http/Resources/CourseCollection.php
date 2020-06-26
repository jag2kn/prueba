<?php

namespace App\Http\Resources;

use App\Course;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\CourseResource;

class CourseCollection extends ApiResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Transforms the collection to match format in CourseResource.
        $this->collection->transform(function (Course $course) {
            return (new CourseResource($course));
        });

        return parent::toArray($request);
    }
}
