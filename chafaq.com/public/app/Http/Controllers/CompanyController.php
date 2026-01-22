<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
class CompanyController extends Controller
{
    public function getAdoptionScript(Request $request, $companyId)
{
    $company = Company::findOrFail($companyId);
/*
    $script = <<<RSC
:local serial "12345"
:local version [/system resource get version]
:local cpu [/system resource get cpu-load]
:local mem [/system resource get free-memory]
:local uptime [/system resource get uptime]
:local mac [/interface ethernet get ether1 mac-address]

:local apiKey "{$company->api_key}"
:local url "http://127.0.0.1:6001/api/router/\$serial"

:local commandUrl "\$url/command"
:local statUrl "\$url/stats"

/tool fetch url="\$commandUrl" http-header-field="X-API-Key: \$apiKey" mode=http dst-path="pending.rsc"
/delay 1
:if ([:len [/file find name="pending.rsc"]] > 0) do={
  /import file-name="pending.rsc"
/file remove "pending.rsc"
}

:local data "version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac"
/tool fetch url="\$statUrl" http-method=post http-data="\$data" http-header-field="X-API-Key: \$apiKey" keep-result=no
RSC;

    return response($script, 200)
        ->header('Content-Type', 'text/plain');
}
*/
/*
    $script = <<<RSC
:local serial [/system routerboard get serial-number]
:local version [/system resource get version]
:local cpu [/system resource get cpu-load]
:local mem [/system resource get free-memory]
:local uptime [/system resource get uptime]
:local mac [/interface ethernet get ether1 mac-address]

:local apiKey "{$company->api_key}"
:local url "https://yourdomain.com/api/router/\$serial"

:local commandUrl "\$url/command"
:local statUrl "\$url/stats"
:local confirmUrl "\$url/commands/executed"

/tool fetch url="\$commandUrl" http-header-field="X-API-Key: \$apiKey" mode=http dst-path="pending.rsc"
/delay 1

:if ([:len [/file find name="pending.rsc"]] > 0) do={

  :local executedCommandIds ""

  :foreach line in=[/file get [find name="pending.rsc"] contents as-value] do={
      :if ([:typeof \$line] = "string") do={
          :if ([:pick \$line 0 23] = ":local executedCommandIds") do={
              :set executedCommandIds [:pick \$line 25 [:len \$line]-1]
          }
      }
  }

  /import file-name="pending.rsc"
  /file remove "pending.rsc"

  :if ([:len \$executedCommandIds] > 0) do={
    /tool fetch url="\$confirmUrl" http-method=post http-data="ids=\$executedCommandIds" http-header-field="X-API-Key: \$apiKey" keep-result=no
  }
}

:local data "version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac"
/tool fetch url="\$statUrl" http-method=post http-data="\$data" http-header-field="X-API-Key: \$apiKey" keep-result=no
RSC;

return response($script, 200)->header('Content-Type', 'text/plain');*/

/*
/system script
add name="mk-sync" policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon source="\
:local serial [/system routerboard get serial-number];\
:local version [/system resource get version];\
:local cpu [/system resource get cpu-load];\
:local mem [/system resource get free-memory];\
:local uptime [/system resource get uptime];\
:local mac [/interface ethernet get ether1 mac-address];\
\
:local apiKey \"REPLACE_API_KEY\";\
:local url \"https://yourdomain.com/api/router/\$serial\";\
\
:local commandUrl \"\$url/command\";\
:local statUrl \"\$url/stats\";\
:local confirmUrl \"\$url/commands/executed\";\
\
/tool fetch url=\"\$commandUrl\" http-header-field=\"X-API-Key: \$apiKey\" mode=http dst-path=\"pending.rsc\";\
/delay 1;\
\
:if ([:len [/file find name=\"pending.rsc\"]] > 0) do={\
    :local executedCommandIds \"\";\
    :foreach line in=[/file get [find name=\"pending.rsc\"] contents as-value] do={\
        :if ([:typeof \$line] = \"string\") do={\
            :if ([:pick \$line 0 23] = \":local executedCommandIds\") do={\
                :set executedCommandIds [:pick \$line 25 [:len \$line]-1];\
            }\
        }\
    };\
\
    /import file-name=\"pending.rsc\";\
    /file remove \"pending.rsc\";\
\
    :if ([:len \$executedCommandIds] > 0) do={\
        /tool fetch url=\"\$confirmUrl\" http-method=post http-data=\"ids=\$executedCommandIds\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\
    };\
};\
\
:local data \"version=\$version&cpu=\$cpu&mem=\$mem&uptime=\$uptime&mac=\$mac\";\
/tool fetch url=\"\$statUrl\" http-method=post http-data=\"\$data\" http-header-field=\"X-API-Key: \$apiKey\" keep-result=no;\"

/system scheduler
add name="mk-runner" interval=1m start-time=startup on-event="/system script run mk-sync"

*/
}
/*
public function download(Company $company)
{
    $script = <<<RSC
:local serial ""
:do { :set serial [/system routerboard get serial-number] } on-error={ :set serial "12345" }

:local version [/system resource get version]
:local mac [/interface ethernet get [find default-name=ether1] mac-address]
:local apiKey "{$company->api_key}"
:local url "http://192.168.1.12:8000/router/\$serial"

/tool fetch url="\$url/adopt" http-method=post http-data="mac=\$mac&version=\$version" http-header-field="X-API-Key: \$apiKey" keep-result=no
RSC;

    return response($script, 200)->header('Content-Type', 'text/plain');
}*/
/*
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
    }*/


    public function download(Company $company)
    {
     $script = <<<RSC
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

:local apiKey "{$company->api_key}"
:local url "http://192.168.1.12:8000/api/router/\$serial"

# إرسال طلب التبني
/tool fetch url="\$url/adopt" http-method=post http-data="mac=\$mac&version=\$version" http-header-field="X-API-Key: \$apiKey" keep-result=no

# جلب ملف التهيئة
:local configureUrl "\$url/configure"
/tool fetch url="\$configureUrl" http-header-field="X-API-Key: \$apiKey" mode=http dst-path="pending.rsc"
/import file-name="pending.rsc"

RSC;

    $script = str_replace("\r\n", "\n", $script);
        return response($script)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename="router-setup.rsc"');
          
    }

    public function list(Request $request){
        $city=$request->selectedCity;
        $area = $request->selectedArea;
        $street= $request->selectedStreet;
        
        return Company::all();
    }
}
