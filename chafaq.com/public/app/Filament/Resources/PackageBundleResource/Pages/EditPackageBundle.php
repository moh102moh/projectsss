<?php

namespace App\Filament\Resources\PackageBundleResource\Pages;

use App\Filament\Resources\PackageBundleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPackageBundle extends EditRecord
{
    protected static string $resource = PackageBundleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
