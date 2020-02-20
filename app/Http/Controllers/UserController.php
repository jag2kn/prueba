<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\User;
class UserController extends Controller
{
  public function __construct()
  {
    //  $this->middleware('auth:api');
  }
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function authenticate(Request $request)
  {
    $this->validate($request, [
     'email' => 'required',
     'password' => 'required'
      ]);
    $user = User::where('email', $request->input('email'))->first();
    if(Hash::check($request->input('password'), $user->password)){
      $apikey = base64_encode(str_random(40));
      User::where('email', $request->input('email'))->update(['api_key' => "$apikey"]);;
      return response()->json(['status' => 'success','api_key' => $apikey]);
    }else{
      return response()->json(['status' => 'fail'],401);
    }
  }
  

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
      $users = User::all();
      return response()->json(['status' => 'success','result' => $users]);
  }
  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
      $this->validate($request, [
      'todo' => 'required',
      'description' => 'required',
      'category' => 'required'
       ]);
      if(Auth::user()->todo()->Create($request->all())){
          return response()->json(['status' => 'success']);
      }else{
          return response()->json(['status' => 'fail']);
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
      $todo = Cert::where('id', $id)->get();
      return response()->json($todo);
      
  }
  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function edit($id)
  {
      $todo = Cert::where('id', $id)->get();
      return view('todo.edittodo',['todos' => $todo]);
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
      $this->validate($request, [
      'todo' => 'filled',
      'description' => 'filled',
      'category' => 'filled'
       ]);
      $todo = Cert::find($id);
      if($todo->fill($request->all())->save()){
         return response()->json(['status' => 'success']);
      }
      return response()->json(['status' => 'failed']);
  }
  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
      if(Cert::destroy($id)){
           return response()->json(['status' => 'success']);
      }
  }  
  
}    
?>
