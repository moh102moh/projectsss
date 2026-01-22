<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PayementMethodResource\Pages;
use App\Filament\Resources\PayementMethodResource\RelationManagers;
use App\Models\PayementMethod;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\ViewColumn;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PayementMethodResource extends Resource
{
    protected static ?string $model = PayementMethod::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                 TextInput::make('name')
                ->required()
                ->maxLength(255),

            Textarea::make('body')
                ->label('Text Content')
                ->rows(5),

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
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
            TextColumn::make('media_type'),
        /*  ViewColumn::make('media_type')
    ->label('Media')
    ->view('filament.components.video-thumbnail')*/
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
            'index' => Pages\ListPayementMethods::route('/'),
            'create' => Pages\CreatePayementMethod::route('/create'),
            'edit' => Pages\EditPayementMethod::route('/{record}/edit'),
        ];
    }
      public static function getNavigationLabel(): string
{
    return __('resources.payementMethods'); 
}
public static function getNavigationSort(): ?int
{
    return 30; 
}
}
