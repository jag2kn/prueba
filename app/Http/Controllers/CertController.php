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
use App\Course;
use QrCode;

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function getCourse($id){
  try {
      $course = Course::where('id', $id)->firstOrFail();
      return $course;
  } catch (Exception $e) {
      return $this->responseServerError('Error query resource.');
  }
}

class CertController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $collection = Cert::with('user');

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
                'name' => request('name'),
                'document' => request('document'),
                'course' => request('course'),
                'startDate' => request('startDate'),
                'endDate' => request('endDate'),
                'city' => request('city'),
                'code' => generateRandomString(20),
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
            //if ($cert->user_id === $user->id) {
                if (request('number')) {
                    $cert->number = request('number');
                }
                if (request('name')) {
                    $cert->name = request('name');
                }
                if (request('document')) {
                    $cert->document = request('document');
                }
                if (request('course')) {
                    $cert->name = request('course');
                }
                if (request('startDate')) {
                    $cert->startDate = request('startDate');
                }
                if (request('endDate')) {
                    $cert->endDate = request('endDate');
                }
                if (request('city')) {
                    $cert->city = request('city');
                }
                $cert->save();
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

        $cert = Cert::where('id', $id)->firstOrFail();

        // User can only delete their own data.
        //if ($cert->user_id !== $user->id) {
        //    return $this->responseUnauthorized();
        //}

        try {
            $cert->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }
    
    /**
     * Generate pdf
     *
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Request $request, $id)
    {
        $pdf = app('dompdf.wrapper');
        try{
          $cert = Cert::where('code', $id)->firstOrFail();
          
          $course = getCourse($cert->course);
          
          
          $pdf->loadHTML(
            '<div style="text-align:center;">'.
              '<img src="'.base_path().'/public/imgs/logo.png" alt="Logo" height="150px">'.
              '<h1>Centro de Enseñanza Automovilística FENIX BOGOTA,<br/>y EXCELSIOR SECURITAS LABORUM S.A.S.</h1>'.
              '<h2>Certifican a:</h2>'.
              '<h1>'.$cert->name.'</h1>'.
              '<h1>'."CC ". $cert->document.'</h1>'.
              '<h2>'.$course->name.'<br/>'.$course->description.'</h2>'.
              "<div>Curso tomado entre ".$cert->startDate." y ".$cert->endDate." en la ciudad de ".$cert->city."</div><br/>".
              "Url de validación: ".url()->current()."<br/>".
              '<img src="data:image/png;base64, '.
                base64_encode(
                  QrCode::color(120, 14, 14)->format('png')->generate(url()->current())).'"/>'.
            '</div>'
          )->setPaper('letter', 'landscape');
          return $pdf->stream('cert.pdf');
        }catch (Exception $e) {
            return $this->responseServerError('Certificado inexistente.');
        }
    }
}
