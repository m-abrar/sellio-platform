@props([
    'icon' => 'fas fa-inbox',
    'title' => 'No Data Found',
    'description' => 'It looks like there are no records here yet.',
    'actionText' => null,
    'actionUrl' => null,
])

<div class="premium-empty-state text-center py-5 reveal-up">
    <div class="empty-state-icon-wrapper mb-4">
        <div class="empty-state-blob"></div>
        <i class="{{ $icon }} empty-state-icon"></i>
    </div>
    
    <h3 class="fw-bold text-dark mb-2">{{ $title }}</h3>
    <p class="text-muted mx-auto mb-4" style="max-width: 400px;">
        {{ $description }}
    </p>

    @if($actionText && $actionUrl)
        <a href="{{ $actionUrl }}" class="btn btn-premium px-4 py-2 rounded-pill">
            <i class="fas fa-plus me-2"></i> {{ $actionText }}
        </a>
    @endif
</div>

<style>
    .premium-empty-state {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 24px;
        box-shadow: var(--shadow-premium, 0 10px 30px rgba(0,0,0,0.05));
    }

    .empty-state-icon-wrapper {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .empty-state-blob {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%);
        border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
        animation: blob-bounce 8s infinite ease-in-out;
    }

    .empty-state-icon {
        font-size: 3rem;
        color: var(--primary, #6366f1);
        z-index: 2;
        filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2));
    }

    @keyframes blob-bounce {
        0%, 100% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; transform: scale(1); }
        33% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1.1) rotate(10deg); }
        66% { border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; transform: scale(0.9) rotate(-10deg); }
    }

    .btn-premium {
        background: var(--primary, #6366f1);
        color: #fff;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .btn-premium:hover {
        background: var(--primary-hover, #4f46e5);
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
</style>
