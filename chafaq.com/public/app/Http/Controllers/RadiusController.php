<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Cookie\CookieJar;
use App\Models\Customer;
class RadiusController extends Controller
{
    protected $baseUrl = 'http://ipip.mywire.org:15118';
    protected $username = 'Hwez';
    protected $password = '1234';
 public function all_users(Request $request){
      

 // Step 1: Generate MD5 hash
    $md5Password = md5($this->password);
    $md5Final = hmac_md5($this->username, $md5Password);

    // Step 2: Prepare client with cookie support
    $client = new \GuzzleHttp\Client([
        'base_uri' => $this->baseUrl,
        'cookies' => true, // to maintain session
   
    ]);
// Step 3: Login
    $response = $client->post('/radiusmanager/admin.php?cont=login', [
        'form_params' => [
            'managername' => $this->username,
            'password' => '', // JS clears it
            'md5' => $md5Final,
            'url' => '',
            'lang' => 'Arabic',
        ],
    ]);

// 2. تنفيذ البحث
$searchResponse = $client->post('/radiusmanager/admin.php?cont=list_users', [
    'form_params' => [
        
        'Submit' => 'بحث',
        'setcookie' => 1, // كما في النموذج الأصلي
        'listacctype' => 91, // يمثل كل أنواع الحسابات: 1+2+8+16+64
    ],
]);

$html = (string) $searchResponse->getBody();
 // Step 5: Parse HTML (you need to install DomCrawler via composer)
    $crawler = new Crawler($html);
 // Step 6: Extract rows (example for parsing table rows)
    $rows = $crawler->filter('table tr')->each(function (Crawler $tr, $i) {
        return $tr->filter('td')->each(function (Crawler $td) {
            return trim($td->text());
        });
    });


$users =$this-> extractSubscribers($rows);

return response()->json([
    'status' => 'success',
    'count' => count($users),
    'subscribers' => $users,
]);


        }

 public function userTraficc (Request $request) {
$baseUrl = 'http://ipip.mywire.org:15118';
    $username = 'Khaldoon';
    $password = '1234';

    // Step 1: Generate MD5 hash
    $md5Password = md5($password);
    $md5Final = hmac_md5($username, $md5Password);

    // Step 2: Prepare client with cookie support
    $client = new \GuzzleHttp\Client([
        'base_uri' => $baseUrl,
        'cookies' => true, // to maintain session
    ]);
// Step 3: Login
    $response = $client->post('/radiusmanager/user.php?cont=login', [
        'form_params' => [
            'username' => $username,
            'password' => '', // JS clears it
            'md5' => $md5Final,
            'url' => '',
            'lang' => 'Arabic',
        ],
    ]);
// Step 4: Access users page
    $usersPage = $client->get('/radiusmanager/user.php?cont=traffic_report');
    $html = (string) $usersPage->getBody();

    // Step 5: Parse HTML (you need to install DomCrawler via composer)
    $crawler = new Crawler($html);

    // Step 6: Extract rows (example for parsing table rows)
    $rows = $crawler->filter('table tr')->each(function (Crawler $tr, $i) {
        return $tr->filter('td')->each(function (Crawler $td) {
            return trim($td->text());
        });
    });
  
     return extractTraficc($rows);
    return response()->json([
        'rows' => $rows,
    ]);
    
}

  public function user_packages(Request $request){
        $user_phone=$request->mobile;
     

 // Step 1: Generate MD5 hash
    $md5Password = md5($this->password);
    $md5Final = hmac_md5($this->username, $md5Password);

    // Step 2: Prepare client with cookie support
    $client = new \GuzzleHttp\Client([
        'base_uri' => $this->baseUrl,
        'cookies' => true, // to maintain session
   
    ]);
// Step 3: Login
    $response = $client->post('/radiusmanager/admin.php?cont=login', [
        'form_params' => [
            'managername' => $this->username,
            'password' => '', // JS clears it
            'md5' => $md5Final,
            'url' => '',
            'lang' => 'Arabic',
        ],
    ]);

// 2. تنفيذ البحث
$searchResponse = $client->post('/radiusmanager/admin.php?cont=list_users', [
    'form_params' => [
        'mobile' =>$user_phone , // رقم الهاتف المطلوب البحث عنه
        'Submit' => 'بحث',
        'setcookie' => 1, // كما في النموذج الأصلي
        'listacctype' => 91, // يمثل كل أنواع الحسابات: 1+2+8+16+64
    ],
]);

$html = (string) $searchResponse->getBody();
 // Step 5: Parse HTML (you need to install DomCrawler via composer)
    $crawler = new Crawler($html);
 // Step 6: Extract rows (example for parsing table rows)
    $rows = $crawler->filter('table tr')->each(function (Crawler $tr, $i) {
        return $tr->filter('td')->each(function (Crawler $td) {
            return trim($td->text());
        });
    });


$users =$this-> extractSubscribers($rows);

return response()->json([
    'status' => 'success',
    'count' => count($users),
    'subscribers' => $users,
]);


        }

        public function user_routers_by_mobile(Request $request){

   
        $user_phone=$request->user_phone;
     

 // Step 1: Generate MD5 hash
    $md5Password = md5($this->password);
    $md5Final = hmac_md5($this->username, $md5Password);

    // Step 2: Prepare client with cookie support
    $client = new \GuzzleHttp\Client([
        'base_uri' => $this->baseUrl,
        'cookies' => true, // to maintain session
   
    ]);
// Step 3: Login
    $response = $client->post('/radiusmanager/admin.php?cont=login', [
        'form_params' => [
            'managername' => $this->username,
            'password' => '', // JS clears it
            'md5' => $md5Final,
            'url' => '',
            'lang' => 'Arabic',
        ],
    ]);

// 2. تنفيذ البحث
$searchResponse = $client->post('/radiusmanager/admin.php?cont=list_users', [
    'form_params' => [
        'mobile' =>$user_phone , // رقم الهاتف المطلوب البحث عنه
        'Submit' => 'بحث',
        'setcookie' => 1, // كما في النموذج الأصلي
        'listacctype' => 91, // يمثل كل أنواع الحسابات: 1+2+8+16+64
    ],
]);

$html = (string) $searchResponse->getBody();
 // Step 5: Parse HTML (you need to install DomCrawler via composer)
    $crawler = new Crawler($html);
 // Step 6: Extract rows (example for parsing table rows)
    $rows = $crawler->filter('table tr')->each(function (Crawler $tr, $i) {
        return $tr->filter('td')->each(function (Crawler $td) {
            return trim($td->text());
        });
    });


$users =$this-> extractSubscribers($rows);

return response()->json([
    'status' => 'success',
    'count' => count($users),
    'subscribers' => $users,
]);


        }
  public function user_routers(Request $request){

     $user=  $request->user();
        $user_phone=$user->phone;
     

 // Step 1: Generate MD5 hash
    $md5Password = md5($this->password);
    $md5Final = hmac_md5($this->username, $md5Password);

    // Step 2: Prepare client with cookie support
    $client = new \GuzzleHttp\Client([
        'base_uri' => $this->baseUrl,
        'cookies' => true, // to maintain session
   
    ]);
// Step 3: Login
    $response = $client->post('/radiusmanager/admin.php?cont=login', [
        'form_params' => [
            'managername' => $this->username,
            'password' => '', // JS clears it
            'md5' => $md5Final,
            'url' => '',
            'lang' => 'Arabic',
        ],
    ]);

// 2. تنفيذ البحث
$searchResponse = $client->post('/radiusmanager/admin.php?cont=list_users', [
    'form_params' => [
        'mobile' =>$user_phone , // رقم الهاتف المطلوب البحث عنه
        'Submit' => 'بحث',
        'setcookie' => 1, // كما في النموذج الأصلي
        'listacctype' => 91, // يمثل كل أنواع الحسابات: 1+2+8+16+64
    ],
]);

$html = (string) $searchResponse->getBody();
 // Step 5: Parse HTML (you need to install DomCrawler via composer)
    $crawler = new Crawler($html);
 // Step 6: Extract rows (example for parsing table rows)
    $rows = $crawler->filter('table tr')->each(function (Crawler $tr, $i) {
        return $tr->filter('td')->each(function (Crawler $td) {
            return trim($td->text());
        });
    });


$users =$this-> extractSubscribers($rows);

return response()->json([
    'status' => 'success',
    'count' => count($users),
    'subscribers' => $users,
]);


        }
 function extractSubscribers($rows)
{
    $flat = [];

    // تفريغ كامل المصفوفة إلى مصفوفة واحدة
    foreach ($rows as $row) {
        foreach ($row as $cell) {
            $text = trim(strip_tags($cell));
            if ($text !== '') {
                $flat[] = $text;
            }
        }
    }

    $subscribers = [];
    $seen = [];

    for ($i = 0; $i < count($flat) - 25; $i++) {
        // نبحث عن الصف الذي يبدأ بـ 1. أو 2. ...
        if (preg_match('/^\d+\.$/', $flat[$i])) {
            $username = $flat[$i + 1] ?? '';
            if ($username && !in_array($username, $seen)) {
                $seen[] = $username;

                $subscribers[] = [
                    'username'   => $username,
                    'speed'     => $flat[$i + 2] ?? '',
                    'expire'         => $flat[$i + 3] ?? '',
                    'firstname'    => $flat[$i + 8] ?? '',
                    'lastname'    => $flat[$i + 9] ?? '',
                    'registerd'    => $flat[$i + 10] ?? '',
                ];
            }
        }
    }

    return [
        'status' => 'success',
        'count' => count($subscribers),
        'subscribers' => $subscribers,
    ];
}

function fetchRadiusUsers()
{
    $loginUrl = 'http://ipip.mywire.org:15118/radiusmanager/index.php'; // صفحة تسجيل الدخول
    $listUrl = 'http://ipip.mywire.org:15118/radiusmanager/admin.php?cont=list_users';

    $username = 'admin'; // عدل حسب بياناتك
    $password = 'yourpassword';

    // 1. إرسال طلب تسجيل دخول
    $response = Http::asForm()->withCookies([], 'ipip.mywire.org')->post($loginUrl, [
        'username' => $username,
        'password' => $password,
        'submit' => 'Login', // تأكد من اسم الزر إن لزم
    ]);

    // 2. حفظ الكوكيز
    $cookies = $response->cookies();

    // 3. إرسال طلب الصفحة المحمية
    $html = Http::withCookies($cookies->toArray(), 'ipip.mywire.org')->get($listUrl)->body();

    // 4. استخدام Crawler لاستخلاص البيانات من الجدول
    $crawler = new Crawler($html);

    $users = [];

    $crawler->filter('table tr')->each(function ($row, $i) use (&$users) {
        $columns = $row->filter('td')->each(function ($td) {
            return trim($td->text());
        });

        if (!empty($columns)) {
            $users[] = $columns;
        }
    });

    return $users;
}


}


function hmac_md5($key, $data) {
    return hash_hmac('md5', $data, $key);
}

 function extractTraficc($rows)
{
    $stats = [];

   $stats=$rows[14];


    return [
        'status' => 'success',
        'user'=>$stats[1],
        'timeonnet'=>$stats[2],
        'download'=>$stats[3],
        'upload'=>$stats[4],
        'total'=>$stats[5],
       
        
    ];
}