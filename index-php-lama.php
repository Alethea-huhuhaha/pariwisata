<?php
require __DIR__ . '/data.php';

function foto(string $file): string
{
    if (file_exists(__DIR__ . '/img/' . $file)) {
        return "background: url('img/" . htmlspecialchars($file) . "') center / cover;";
    }
    return 'background: linear-gradient(120deg,#164b9c,#55b5d9);';
}

echo '<!DOCTYPE html>';
echo '<html lang="id">';
echo '<head>';
echo '<meta charset="UTF-8">';
echo '<meta name="description" content="Jelajahi keindahan dan pesona wisata Lampung: pantai, pulau, dan destinasi budaya.">';
echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
echo '<title>Wisata Lampung</title>';
echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
echo '<link rel="icon" type="image/png" href="img/18.png">';
echo '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';
echo '<link rel="stylesheet" href="style-php-lama.css">';
echo '</head>';
echo '<body>';

// NAVBAR KEMBALI SEPERTI KODE AWAL
echo '<header class="topbar">';
echo '<nav class="search-card">';

    echo '<a href="#explore" class="search-item">';
   
    echo '<div class="text-container"><span class="label">WISATA LAMPUNG</span></div>';
    echo '</a>';

    echo '<div class="nav-center" id="navMenu">';
    echo '<a href="#explore" class="search-item"><div class="text-container"><span class="label">BERANDA</span></div></a>';
    echo '<a href="#tentang" class="search-item"><div class="text-container"><span class="label">TENTANG LAMPUNG</span></div></a>';
    echo '<a href="#destinasi" class="search-item"><div class="text-container"><span class="label">DESTINASI POPULER</span></div></a>';
    echo '<a href="#galeri" class="search-item"><div class="text-container"><span class="label">GALERI</span></div></a>';
    echo '</div>';

    echo '<button class="burger" id="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="navMenu">&#9776;</button>';

echo '</nav>';
echo '</header>';

echo '<main class="hero" id="explore">';


foreach ($slides as $i => $slide) {
    $activePanel = ($i === 0) ? 'active' : '';
    $bgStyle = foto($slide['image']);
    $title = htmlspecialchars($slide['title']);
    $desc = htmlspecialchars($slide['description']);

    echo '<div class="hero-panel ' . $activePanel . '">';
    echo '<div class="hero-image" style="' . $bgStyle . '"></div>';
    echo '<div class="hero-text">';

    // Search Card Form tetap di atas judul
    
    echo '<h1>' . $title . '</h1>';
    echo '<p class="lead">' . $desc . '</p>';
    echo '</div>';
    echo '</div>';
}

echo '<button class="slide-btn prev" type="button" aria-label="Slide sebelumnya">❮</button>';
echo '<button class="slide-btn next" type="button" aria-label="Slide berikutnya">❯</button>';

echo '<div class="slide-dots">';
foreach ($slides as $i => $slide) {
    $activeDot = ($i === 0) ? 'active' : '';
    echo '<button class="dot ' . $activeDot . '" aria-label="Pilih slide ' . ($i + 1) . '"></button>';
}
echo '</div>';

echo '</main>';

// TENTANG LAMPUNG
echo '<section class="section" id="tentang">';
echo '<h2>Tentang Lampung</h2>';
echo '<p class="section-text">Lampung adalah sebuah tanah surga tersembunyi di ujung pulau Sumatra yang selalu berhasil memukau siapa saja yang datang mengunjunginya. Di sana, keindahan alam berpadu 
    sempurna dengan kehangatan budaya lokal, mulai dari megahnya ikon Menara Siger yang berdiri anggun menyambut para pelancong hingga bentangan pantai berpasir putih dan laut biru jernih di Pulau Pahawang
    yang menenangkan jiwa. Menjelajahi Lampung bukan sekadar menikmati pemandangan yang memanjakan mata, tetapi juga merajut kenangan indah di tanah Sang Bumi Ruwa Jurai yang kaya akan pesona.</p>';
echo '</section>';

echo '<script src="script-php-lama.js"></script>';
echo '</body>';
echo '</html>';
