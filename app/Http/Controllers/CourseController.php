<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Custom\Hasher;
use App\Http\Controllers\APIController;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseResource;
use App\Course;

class CourseController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Get course from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $collection = new Course();

        // Check query string filters.

        $collection = $collection->latest()->paginate();

        return new CourseCollection($collection);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Get course from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Validate all the required parameters have been sent.
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $course = Course::create([
                'name' => request('name'),
                'description' => request('description'),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'id' => $course->id
            ], 201);
        } catch (Exception $e) {
            return $this->responseServerError('Error creating resource.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Get course from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $course = Course::where('id', $id)->firstOrFail();
        return new CourseResource($course);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Validates data.
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'description' => 'string',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        try {
            $course = Course::where('id', $id)->firstOrFail();
            if (request('name')) {
                $course->name = request('name');
            }
            if (request('description')) {
                $course->description = request('description');
            }
            $course->save();
            return $this->responseResourceUpdated();
        } catch (Exception $e) {
            return $this->responseServerError('Error updating resource.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        // Get course from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $course = Course::where('id', $id)->firstOrFail();

        try {
            $course->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }

}
