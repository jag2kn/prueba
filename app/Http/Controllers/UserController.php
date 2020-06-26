<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Custom\Hasher;
use App\Http\Controllers\APIController;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\User;
use QrCode;

class UserController extends ApiController
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

        $collection = new User();

        // Check query string filters.

        $collection = $collection->latest()->paginate();

        return new UserCollection($collection);
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
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $user = User::create([
                'name' => request('name'),
                'email' => request('email'),
                'password' => Hash::make(request('password')),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'id' => $user->id
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

        $user = User::where('id', $id)->firstOrFail();
        return new UserResource($user);
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

        // Validates data.
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'email' => 'string',
            'password' => 'string',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        try {
            $user = User::where('id', $id)->firstOrFail();
            if (request('name')) {
                $user->name = request('name');
            }
            if (request('email')) {
                $user->email = request('email');
            }
            if (request('password')) {
                $user->password = Hash::make(request('password'));
            }
            $user->save();
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
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $user = User::where('id', $id)->firstOrFail();

        try {
            $user->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }

}
