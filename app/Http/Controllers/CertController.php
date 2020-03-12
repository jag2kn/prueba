<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Custom\Hasher;
use App\Http\Controllers\APIController;
use App\Http\Resources\CertCollection;
use App\Http\Resources\CertResource;
use App\Cert;

class CertController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $collection = Cert::where('user_id', $user->id);

        // Check query string filters.
        if ($status = $request->query('status')) {
            if ('open' === $status || 'closed' === $status) {
                $collection = $collection->where('status', $status);
            }
        }

        $collection = $collection->latest()->paginate();

        // Appends "status" to pagination links if present in the query.
        if ($status) {
            $collection = $collection->appends('status', $status);
        }

        return new CertCollection($collection);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Validate all the required parameters have been sent.
        $validator = Validator::make($request->all(), [
            'number' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $cert = Cert::create([
                'user_id' => $user->id,
                'number' => request('number'),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'id' => $cert->id
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
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // User can only acccess their own data.
        if ($cert->user_id === $user->id) {
            return $this->responseUnauthorized();
        }

        $cert = Cert::where('id', $id)->firstOrFail();
        return new CertResource($cert);
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
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Validates data.
        $validator = Validator::make($request->all(), [
            'number' => 'string',
            'status' => 'in:closed,open',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        try {
            $cert = Cert::where('id', $id)->firstOrFail();
            if ($cert->user_id === $user->id) {
                if (request('number')) {
                    $cert->number = request('number');
                }
                if (request('status')) {
                    $cert->status = request('status');
                }
                $cert->save();
                return $this->responseResourceUpdated();
            } else {
                return $this->responseUnauthorized();
            }
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
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $cert = Cert::where('id', $id)->firstOrFail();

        // User can only delete their own data.
        if ($cert->user_id !== $user->id) {
            return $this->responseUnauthorized();
        }

        try {
            $cert->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }
}
