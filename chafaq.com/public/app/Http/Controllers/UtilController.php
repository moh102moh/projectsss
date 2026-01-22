<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UtilController extends Controller
{
    
    function calculateDistance(Request $request) {
$startCoord=$request->start;
$endCoord=$request->end;
$unit='km';
    // تحويل السلسلة إلى أرقام
    list($lat1, $lon1) = array_map('floatval', explode(',', $startCoord));
    list($lat2, $lon2) = array_map('floatval', explode(',', $endCoord));

    // تحويل الدرجات إلى راديان
    $lat1 = deg2rad($lat1);
    $lon1 = deg2rad($lon1);
    $lat2 = deg2rad($lat2);
    $lon2 = deg2rad($lon2);

    $deltaLat = $lat2 - $lat1;
    $deltaLon = $lon2 - $lon1;

    $a = sin($deltaLat / 2) ** 2 +
         cos($lat1) * cos($lat2) *
         sin($deltaLon / 2) ** 2;

    $c = 2 * asin(sqrt($a));

    $earthRadius = 6371; // بالكيلومتر

    $distance = $earthRadius * $c;

    if ($unit === 'm') {
        return $distance * 1000; // بالمتر
    }

    return $distance.'km'; // بالكيلومتر
}

}
