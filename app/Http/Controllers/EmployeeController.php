<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Custom\Hasher;
use App\Http\Controllers\APIController;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Employee;
use App\Company;


class EmployeeController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
    
        // Get company from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $collection = new Employee();

        // Check query string filters.

        $collection = $collection->latest()->paginate();

        return new EmployeeCollection($collection);
      /*
        $collection = Employee::with('company');

        $document = $request->query('document');
        if (!$document) {
          // Get user from $request token.
          if (! $user = auth()->setRequest($request)->user()) {
              return $this->responseUnauthorized();
          }
        }else{
            $collection = $collection->where('document', $document);
        }


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

        return new EmployeeCollection($collection);*/
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
            'lastName' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $employee = Employee::create([
                'company_id' => request('company_id'),
                'name' => request('name'),
                'lastName' => request('lastName'),
                'email' => request('email'),
                'phone' => request('phone'),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'id' => $employee->id
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


        $employee = Employee::where('id', $id)->firstOrFail();
        return new EmployeeResource($employee);
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
            'name' => 'required',
            'lastName' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        try {
            $employee = Employee::where('id', $id)->firstOrFail();
            //if ($employee->user_id === $user->id) {
                if (request('name')) {
                    $employee->name = request('name');
                }
                if (request('lastName')) {
                    $employee->lastName = request('lastName');
                }
                if (request('phone')) {
                    $employee->phone = request('phone');
                }
                if (request('email')) {
                    $employee->email = request('email');
                }
                $employee->save();
                return $this->responseResourceUpdated();
            //} else {
            //    return $this->responseUnauthorized();
            //}
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

        $employee = Employee::where('id', $id)->firstOrFail();

        // User can only delete their own data.
        //if ($employee->user_id !== $user->id) {
        //    return $this->responseUnauthorized();
        //}

        try {
            $employee->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }

}
