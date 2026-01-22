<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\Booking;
class HotelController extends Controller
{
    public function index(){

 return Hotel::With('rooms')->get();
    }

    public function booking(Request $request){
        $user=  $request->user();
      $hotel = $request->get('hotel');
      $rooms = $request->get('rooms');
     
       foreach($rooms as $room)
       {


     Booking::create([
      'customer_id'=>$user->id,
      'hotel_id'=>$hotel['id'],
      'room_id'=>$room['id'],
     'is_active'=>false,

  

      'start_at'=> date('Y-m-d',strtotime($room['startdate'])),
      'expires_at'=> date('Y-m-d',strtotime($room['enddate']))


   ]);
  return response()->json([
                'status'  => true,
                'message' => 'booked',
            ]);
       }


    }


       public function myBookings(Request $request){
        $user=  $request->user();
         $bookings= Booking::with(['hotel','room'])->where('customer_id',$user->id)->get();

           return $bookings;
           return response()->json([
                'status'  => true,
                'bookings' =>  $bookings,
            ]);
       

       }
}
