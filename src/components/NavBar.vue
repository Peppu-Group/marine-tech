<template>
  <!-- Header -->
<header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#">
                <img src="../assets/logo.png" style="height: 40px; width: 40px; margin-right: 20px"/>
                <h1 class="mb-0 fs-4 fw-bold text-primary">Marine<span class="text-info">Tech</span> - Peppubuild</h1>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a class="nav-link fw-semibold px-3" href="#features">Features</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold px-3" href="#platform">Platform</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold px-3" href="#benefits">Benefits</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold px-3" href="#testimonials">Testimonials</a>
                    </li>
                    <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
                        <a class="btn btn-primary px-4 fw-semibold" href="#contact">Contact Us</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>