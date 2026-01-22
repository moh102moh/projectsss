@php
    $isVideo = $record->media_type === 'video';
    $mediaUrl = \Storage::url($record->media_path);
@endphp

@if ($isVideo)
    <div x-data="{ showVideo: false }" class="relative">
        <template x-if="!showVideo">
            <img
                src="https://img.icons8.com/ios-filled/100/play-button-circled.png"
                alt="Play"
                class="w-20 h-20 mx-auto cursor-pointer"
                @click="showVideo = true"
            />
        </template>

        <template x-if="showVideo">
            <video width="240" controls class="mx-auto">
                <source src="{{ $mediaUrl }}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </template>
    </div>
@elseif ($record->media_type === 'image')
    <img src="{{ $mediaUrl }}" alt="Image" class="w-24 h-24 object-cover rounded" />
@endif
