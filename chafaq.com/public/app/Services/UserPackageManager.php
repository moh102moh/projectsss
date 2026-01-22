<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\RouterCommand;

class UserPackageManager
{
    public function process(Customer $user)
    {
        $activePackage = $user->packages()
            ->where('is_active', true)
            ->orderBy('order')
            ->first();

        if (!$activePackage) return;

        if ($activePackage->used_bytes >= $activePackage->limit_bytes) {
            // تعطيل الباقة الحالية
            $activePackage->update(['is_active' => false]);

            // تفعيل الباقة التالية إن وجدت
            $nextPackage = $user->packages()
                ->where('is_active', false)
                ->orderBy('order')
                ->first();

            if ($nextPackage) {
                $nextPackage->update(['is_active' => true]);

                $this->createCommand(
                    $user->router_id,
                    $user->ppp_username,
                    "Change profile to " . $nextPackage->profile_name,
                    "/ppp secret set [find name=\"{$user->ppp_username}\"] profile={$nextPackage->profile_name}"
                );
            } else {
                // لا توجد باقات فعالة، قم بتعطيل المستخدم
                $this->createCommand(
                    $user->router_id,
                    $user->ppp_username,
                    "Disable user after all packages used",
                    "/ppp secret disable [find name=\"{$user->ppp_username}\"]"
                );
            }
        }
    }

    protected function createCommand($routerId, $username, $title, $script)
    {
        RouterCommand::create([
            'router_id' => $routerId,
            'title' => $title,
            'script' => $script,
        ]);
    }
}
