<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HotelResource\Pages;
use App\Filament\Resources\HotelResource\RelationManagers;
use App\Models\Hotel;
use App\Models\Country;
use App\Models\City;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
class HotelResource extends Resource
{
    protected static ?string $model = Hotel::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                   Forms\Components\TextInput::make('name') ->required()
            ->maxLength(255),
  Forms\Components\TextInput::make('description') ->required()
            ->maxLength(255),
             Select::make('country_id')
            ->label('الدولة')
            ->options(Country::all()->pluck('name', 'id'))
            ->reactive()
            ->afterStateUpdated(fn ($state, callable $set) => $set('city_id', null)),
             Select::make('city_id')
    ->label('City')
    ->searchable()->suffixIcon('heroicon-m-home-modern')
    
            ->options(function (callable $get) {
                $countryId = $get('country_id');
                if (!$countryId) return [];

                return City::where('country_id', $countryId)
                    ->pluck('name', 'id');
            }),

             Forms\Components\TextInput::make('latitude') ->required(),
              Forms\Components\TextInput::make('longitude') ->required(),
               Select::make('media_type')
                ->options([
                    'image' => 'Image',
                    'video' => 'Video',
                ])
                ->reactive()
                ,

            FileUpload::make('media_path')
                ->label('Upload Media')
                ->directory('contents')
                ->acceptedFileTypes([
                    'image/*',
                    'video/mp4',
                    'video/quicktime',
                ])
                ->maxSize(51200) // 50MB
                ->visibility('public'),
    Forms\Components\TextInput::make('stars')->numeric()->default(3)->label('عدد النجوم'),
            Forms\Components\TextInput::make('phone')->label('الهاتف'),
                  Repeater::make('services')
    ->label('Services')
    ->schema([
        TextInput::make('service_name')
            ->label('Service Name')
            ->required()
            ->prefixIcon('heroicon-o-wifi'),
        TextInput::make('service_icon')
            ->label('Service Icon')
            ->required()
            ->prefixIcon('heroicon-o-wifi'),
    ])
    ->defaultItems(1)
    ->addActionLabel('Add Hotel Services')
    ->columns(2)
    ->cloneable(),
        Repeater::make('gallery')
    ->label('Gallery')
    ->schema([
       FileUpload::make('gallery_item')
                ->label('Upload Media')
                ->directory('contents')
                ->acceptedFileTypes([
                    'image/*',
                    'video/mp4',
                    'video/quicktime',
                ])
                ->maxSize(51200) // 50MB
                ->visibility('public'),
    ])
    ->defaultItems(1)
    ->addActionLabel('Add Hotel Services')
    ->columns(1)
    ->cloneable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListHotels::route('/'),
            'create' => Pages\CreateHotel::route('/create'),
            'edit' => Pages\EditHotel::route('/{record}/edit'),
        ];
    }
}
