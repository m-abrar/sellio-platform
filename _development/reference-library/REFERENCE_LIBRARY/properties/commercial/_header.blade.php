<nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3">
        <div class="container">
            <a class="navbar-brand h4 fw-bold mb-0" href="#">{!! page_content('global.header.brand', 'CREST PROPERTIES') !!}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Offices</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Retail</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Coworking</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Agents</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
                </ul>
                <a href="{!! page_content('global.header.button_link', '#') !!}" class="btn btn-list-property ms-lg-3">{!! page_content('global.header.button', 'List Property') !!}</a>
            </div>
        </div>
    </nav>