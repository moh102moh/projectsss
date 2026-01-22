<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Router;
use App\Models\RouterCommand;

class RouterController extends Controller
{
    //
/*
public function getCommand($serial)
{
    $router = Router::firstOrCreate([
        'serial_number' => $serial,
    ], [
        'company_id' => 1, // أو حددها من header أو config
    ]);

    $command = $router->commands()->where('executed', false)->first();

    if (!$command) return response('', 204);

    $command->update(['executed' => true]);

    return response($command->script, 200)->header('Content-Type', 'text/plain');
}*/
public function getCommand(Request $request, $serial)
{
    $company = $request->get('company');

    $router = Router::where('serial_number', $serial)
        ->where('company_id', $company->id)
        ->firstOrFail();

    $commands = $router->commands()->where('executed', false)->limit(10)->get();

    if ($commands->isEmpty()) {
        return response('', 204);
    }

    $script = '';
    $ids = [];

    foreach ($commands as $command) {
        $script .= "# Command: $command->title\n";
        $script .= "$command->script\n\n";
        $ids[] = $command->id;

        $command->update([
            'executed' => true,
            'executed_at' => now(),
        ]);
    }

    // توليد معرفات الأوامر المنفذة ليرسلها الراوتر
    $idsLine = ':local executedCommandIds "' . implode(',', $ids) . '"';
    $script = "$idsLine\n\n$script";

    return response($script, 200)->header('Content-Type', 'text/plain');
}



public function postStats(Request $request, $serial)
{
    $router = Router::where('serial_number', $serial)->first();

    if (!$router) return response('Router not found', 404);

    $router->update([
        'ip' => $request->ip(),
        'version' => $request->version,
        'mac_address' => $request->mac,
        'stats' => [
            'cpu' => $request->cpu,
            'mem' => $request->mem,
            'uptime' => $request->uptime,
        ],
    ]);

    return response('OK');
}

    public function download(Router $router)
    {
        $script = <<<RSC
:local serial "{$router->serial}"
:local version [/system resource get version]
:local apiKey "{$router->company->api_key}"
:local url "http://192.168.1.12:8000/api/router/\$serial"

/tool fetch url="\$url/command" http-header-field="X-API-Key: \$apiKey" dst-path="pending.rsc"
/delay 1
:if ([:len [/file find name="pending.rsc"]] > 0) do={
  /import file-name="pending.rsc"
/file remove "pending.rsc"
}
RSC;

        return response($script)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename="router-setup.rsc"');
    }




    public function adopt(Request $request, $serial)
{
     $company = $request->get('company');
    $router = Router::firstOrCreate(
        ['serial_number' => $serial],
        [
            'company_id' => $company->id,
            'mac' => $request->mac,
            'version' => $request->version,
        ]
    );

    $profile_name="2M";
 $rate_limit="2M";
   RouterCommand::create([
    'router_id' => $router->id,
    'title' => 'Add Secret Profile',
    'script' => <<<SCRIPT
/ppp profile add name=$profile_name rate-limit=$rate_limit 
SCRIPT,
]);  


$username = 'user1234';
$password = 'pass1234';
$profile = '2M';
RouterCommand::create([
    'router_id' => $router->id,
    'title' => 'Add PPP User',
    'script' => <<<SCRIPT
/ppp secret add name=$username password=$password profile=$profile
SCRIPT,
]);/*
     $script = <<<RSC
 /system script
add name="mk-sync" policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon source="\
:local serial ""
:local version ""
:local mac ""
 
:do {
  :set serial [/system routerboard get serial-number]
} on-error={ :set serial "12345" }

:if ([:len \$serial] = 0) do={
  :set serial "12345"
}

:do {
  :set version [/system resource get version]
} on-error={ :set version "" }

:do {
  :set mac [/interface ethernet get [find default-name=ether1] mac-address]
} on-error={ :set mac "" }
:local cpu [/system resource get cpu-load];\
:local mem [/system resource get free-memory];\
:local uptime [/system resource get uptime];\


:local apiKey "{$company->api_key}";\
:local url "http://192.168.1.12:8000/api/router/\$serial";\
:local commandUrl \"\$url/command\";\
:local statUrl \"\$url/stats\";\
:local confirmUrl \"\$url/commands/executed\";\

/tool fetch url=\"\$commandUrl\" http-header-field=\"X-API-Key: \$apiKey\" mode=http dst-path=\"pending.rsc\";\
:delay 1;\
:if ([:len [/file find name=\"pending.rsc\"]] > 0) do={\
    :local executedCommandIds \"\";\
    :foreach line in=[/file get [find name=\"pending.rsc\"] contents as-value] do={\
        :if ([:typeof \$line] = \"string\") do={\
            :if ([:pick \$line 0 23] = \":local executedCommandIds\") do={\
                :set executedCommandIds [:pick \$line 25 [:len \$line]-1];\
            }\
        }\
    };\
    /import file-name=\"pending.rsc\";\
    /file remove \"pending.rsc\";\
    :if ([:len \$executedCommandIds] > 0) do={\
        /tool fetch url=\"\$confirmUrl\" http-method=post http-data=\"ids=\$executedCommandIds\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\
    };\
};\
:local data \"version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac\";\
/tool fetch url=\"\$statUrl\" http-method=post http-data=\"\$data\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\
"

/system scheduler
add name="mk-runner" interval=1m start-time=startup on-event="/system script run mk-sync"

RSC;
   return response($script, 200)->header('Content-Type', 'text/plain');

   // return response()->json(['status' => 'adopted']);*/
 /*  $serverUrl = request()->getSchemeAndHttpHost(); // e.g. http://192.168.1.12:8000

    $script = <<<RSC
# 1. جمع معلومات الراوتر
:local serial ""
:do { :set serial [/system routerboard get serial-number] } on-error={ :set serial "12345" }
:if ([:len \$serial] = 0) do={ :set serial "12345" }
:local version ""
:do { :set version [/system resource get version] } on-error={ :set version "" }
:local mac ""
:do { :set mac [/interface ethernet get [find default-name=ether1] mac-address] } on-error={ :set mac "" }


# 3. إضافة سكربت mk-sync
/system script
add name="mk-sync" policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon source="\
:local serial [/system routerboard get serial-number];\
:local version [/system resource get version];\
:local cpu [/system resource get cpu-load];\
:local mem [/system resource get free-memory];\
:local uptime [/system resource get uptime];\
:local mac [/interface ethernet get ether1 mac-address];\
:local apiKey \"{$company->api_key}\";\
:local url \"{$serverUrl}/api/router/\$serial\";\
:local commandUrl \"\$url/command\";\
:local statUrl \"\$url/stats\";\
:local confirmUrl \"\$url/commands/executed\";\
/tool fetch url=\"\$commandUrl\" http-header-field=\"X-API-Key: \$apiKey\" mode=http dst-path=\"pending.rsc\";\
:delay 1;\
:if ([:len [/file find name=\"pending.rsc\"]] > 0) do={\
  :local executedCommandIds \"\";\
  :foreach line in=[/file get [find name=\"pending.rsc\"] contents as-value] do={\
    :if ([:typeof \$line] = \"string\") do={\
      :if ([:pick \$line 0 23] = \":local executedCommandIds\") do={\
        :set executedCommandIds [:pick \$line 25 [:len \$line]-1];\
      }\
    }\
  };\
  /import file-name=\"pending.rsc\";\
  /file remove \"pending.rsc\";\
  :if ([:len \$executedCommandIds] > 0) do={\
    /tool fetch url=\"\$confirmUrl\" http-method=post http-data=\"ids=\$executedCommandIds\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\
  };\
};\
:local data \"version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac\";\
/tool fetch url=\"\$statUrl\" http-method=post http-data=\"\$data\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\
"

# 4. إضافة مجدول كل دقيقة
/system scheduler
add name="mk-runner" interval=1m start-time=startup on-event="/system script run mk-sync"

# 5. تنفيذ السكربت مباشرة لأول مرة
/system script run mk-sync
RSC;
*/
 $serverUrl = request()->getSchemeAndHttpHost();
$script = <<<RSC
                # 1. جمع معلومات الراوتر
            :local serial ""
            :do { :set serial [/system routerboard get serial-number] } on-error={ :set serial "12345" }
            :if ([:len \$serial] = 0) do={ :set serial "12345" }
            :local version ""
            :do { :set version [/system resource get version] } on-error={ :set version "" }
            :local mac ""
            :do { :set mac [/interface ethernet get [find default-name=ether1] mac-address] } on-error={ :set mac "" }
            :local apiKey \"{$company->api_key}\";\
             :local url \"{$serverUrl}/api/router/\$serial\";\
            :local configureUrl \"\$url/configure\";\

            /tool fetch url=\"\$configureUrl\" http-header-field=\"X-API-Key: \$apiKey\" mode=http dst-path=\"pending.rsc\";\


   RSC;

    return response($script, 200)->header('Content-Type', 'text/plain');
}

public function configuradopt(Request $request, $serial)
{
     $company = $request->get('company');
    $router = Router::firstOrCreate(
        ['serial_number' => $serial],
        [
            'company_id' => $company->id,
            'mac' => $request->mac,
            'version' => $request->version,
        ]
    );

   
   //$serverUrl = request()->getSchemeAndHttpHost(); // e.g. http://192.168.1.12:8000
   $serverUrl = "http://192.168.1.12:8000";

$apiKey = $company->api_key;

$script = <<<RSC
/file remove [find name="pending.rsc"]
/system scheduler remove [find name="mk-runner"]
/system script remove [find name="mk-sync"]
# 1. جمع معلومات الراوتر
:local serial ""
:do { :set serial [/system routerboard get serial-number] } on-error={ :set serial "12345" }
:if ([:len \$serial] = 0) do={ :set serial "12345" }
:local version ""
:do { :set version [/system resource get version] } on-error={ :set version "" }
:local mac ""
:do { :set mac [/interface ethernet get [find default-name=ether1] mac-address] } on-error={ :set mac "" }

:local apiKey "{$apiKey}"
:local url "{$serverUrl}/api/router/\$serial"


# 2. إنشاء السكربت الداخلي mk-sync
/system script
add name="mk-sync" policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon source="\
:local serial \"\"; \
:do { :set serial [/system routerboard get serial-number] } on-error={ :set serial \"12345\" }; \
:if ([:len \$serial] = 0) do={ :set serial \"12345\" }; \
:local version [/system resource get version]; \
:local cpu [/system resource get cpu-load]; \
:local mem [/system resource get free-memory]; \
:local uptime [/system resource get uptime]; \
:local mac [/interface ethernet get ether1 mac-address]; \
:local apiKey \"{$apiKey}\"; \
:local url \"{$serverUrl}/api/router/\$serial\"; \

:local commandUrl \"\$url/command\"; \
:local statUrl \"\$url/stats\"; \
:local confirmUrl \"\$url/commands/executed\"; \
/tool fetch url=\"\$url/command\" http-header-field=\"X-API-Key: \$apiKey\" mode=http dst-path=\"pending.rsc\"; \
:delay 1; \
:if ([:len [/file find name=\"pending.rsc\"]] > 0) do={
  :local executedCommandIds \"\"; \
  :local content [/file get [find name=\"pending.rsc\"] contents];\
  
  :foreach line in=[:toarray \$content] do={
    
    :if ([:typeof \$line] = \"string\") do={
      :if ([:pick \$line 0 23] = \":local executedCommandIds\") do={
        :set executedCommandIds [:pick \$line 25 [:len \$line]]
      }
    }
  }

  /import file-name=\"pending.rsc\"
  /file remove \"pending.rsc\"

  :if ([:len \$executedCommandIds] > 0) do={
    /tool fetch url=\"\$url/commands/executed\" http-method=post http-data=\"ids=\$executedCommandIds\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no
  }
}


  :if ([:len \$executedCommandIds] > 0) do={ \
    /tool fetch url=\"\$url/commands/executed\" http-method=post http-data=\"ids=\$executedCommandIds\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no; \
  }; \
}; \
:local data \"version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac\"; \
/tool fetch url=\"\$url/stats\" http-method=post http-data=\"\$data\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no; \
/system script remove [find name=\"mk-sync\"];\
/system scheduler remove [find name=\"mk-runner\"];\
"

 # 3. إضافة Scheduler لتكرار السكربت كل دقيقة
/system scheduler
add name="mk-runner" interval=1m start-time=startup on-event="/system script run mk-sync"

# 4. تشغيل السكربت فورًا لأول مرة
/system script run mk-sync
RSC;



    return response($script, 200)->header('Content-Type', 'text/plain');
}

}
