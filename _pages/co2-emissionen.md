---
layout: default
title: CO2 Emissionen
permalink: co2-emissionen
description: "Alles über CO2-Emissionen: Ursachen, Folgen und effektive Strategien zur Reduktion. EarthCircle informiert und motiviert zum Handeln."
imageURL: "assets/img/hero-co2-emissionen-blank.jpg"
---

<section class="hero-banner hero-emissionen d-flex mobile-hero">
    <div class="c-banner d-lg-block z-1 position-absolute top-0 bottom-0 start-0 end-0"></div>
    <div class="bg-banner d-none d-sm-block position-absolute top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 z-2 z-lg-0"></div>
    <div class="container-fluid text-white position-relative align-items-end justify-content-end z-2">
        <div class="mx-1 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5 my-3 my-md-4 py-3 py-sm-0">
            <div class="row">
                <div class="col-lg-7 offset-lg-4 col-md-10">
                    <h2 class="display-3 small-xs-display fw-bold">Es ist noch ein weiter Weg zum Kreislauf</h2>
                    <p class="lead mb-4">Wir wollen nicht mit dem Finger auf die Wirtschaft zeigen, sondern Potentiale für eine Kreislaufwirschaft aufzeigen.</p>
                    <a href="{{ site.baseurl }}/ueber-uns#mitgliedsantrag" class="btn btn-primary btn-lg">Unterstütze uns dabei</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-dark text-white pt-4 pb-mb-4 mb-5">
    <div class="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5 py-3 py-md-4">
        <div class="container-fluid">
            <div class="row pb-4">
                <div class="col-xl-7 col-md-10">
                    <h2 class="fw-bold mb-5">Ist eine Kreislaufwirtschaft überhaupt realisierbar?</h2>
                    <p class="lead"><span class="fw-bold">Ja – wenn Daten genutzt werden und wir Wissen teilen,</span> schaffen wir die Grundlage dafür, dass Wirtschaft, Politik und Gesellschaft gemeinsam den Schritt in Richtung Kreislaufwirtschaft gehen.</p>
                    <p>Nachhaltige Transformation gelingt nur, wenn die Wirtschaft aktiv eingebunden ist. Genau hier setzt unsere NGO an: Wir werten Daten aus, um Potenziale sichtbar zu machen und Entscheidungsgrundlagen für Unternehmen zu schaffen.</p>
                </div>
            </div>
            <div class="row d-flex align-items-end pb-md-4">
                <div class="col-lg-7 col-md-8">
                    <p>Die 36 größten Emittenten stoßen deshalb so enorme Mengen CO₂ aus, weil sie in erster Linie für die weltweite Nachfrage nach Energie, Rohstoffen und Materialien produzieren. <strong>Ihre Emissionen spiegeln somit nicht nur ihr eigenes Handeln wider, sondern den globalen Bedarf, den sie bedienen.</strong> Daher sollten sie nicht isoliert betrachtet werden, sondern vielmehr als exemplarische Stellvertreter für ganze Wertschöpfungsketten und Konsummuster verstanden werden.</p>
                </div>
                <div class="offset-xxl-1 col-lg-4 col-md-4 d-flex flex-column align-items-md-end align-items-xxl-start text-md-end text-xxl-start mt-3 mt-md-0">
                    <!-- Javascript-Counter -->
                    <span class="overshoot-date fw-bold"><span class="fw-light fs-1">~</span><span class="counter" data-number="40">0</span>%</span>
                    <p class="mt-3 opacity-50 small">der globalen CO₂-Emissionen<br/>stammen von 36 Unternehmen.</p>
                </div> 
            </div>            
        </div>
    </div>
</section>

<section class="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5 py-3 py-md-4">
    <div class="container-fluid">
        <div class="row mb-3 align-items-center">
            <div class="col-xl-12 col-lg-11"><h2 class="fw-bold">CO₂-Emissionen globaler Unternehmen</h2></div>
            <div class="col-xl-6 col-lg-7 py-4">
                <p class="lead">Die folgenden Daten stammen aus dem <span class="fw-bold">Carbon Majors Report 2023</span> und beziehen sich ausschließlich auf die 36 größten globalen Unternehmen, da diese zusammen fast 40 % der weltweiten CO₂-Emissionen verursachen.</p>
                <p>Die Daten verdeutlichen die global vernetzte Produktion und machen sichtbar, dass die Emissionen nicht allein den produzierenden Ländern zugerechnet werden können. Vielmehr zeigt die Statistik, wie groß unser gemeinsamer Energie- und Ressourcenbedarf weltweit ist und welche Rolle die internationalen Wertschöpfungsketten dabei spielen.</p>
                <p><span class="text-primary"><strong>Bitte beachten:</strong></span> Die folgenden Daten sind nicht geprüft, da es sich bei dieser Seite um ein fiktives Projekt handelt. <strong>Die Datensätze wurden mit KI erzeugt und sind nicht wissenschaftlich geprüft!</strong></p>
            </div>   
            <div class="col-xl-12 col-lg-5 pt-5">
                <!-- Chart-Container -->
                <div class="row mb-5 chart-container">
                    <div class="col-md-6 col-lg-12 col-xl-3 offset-xl-2 text-md-center text-lg-start text-xl-center d-flex flex-md-column flex-lg-row flex-xl-column mb-3 mb-xl-0 align-items-center">
                        <div class="emissionen-container"><canvas id="companyChart"></canvas></div>
                        <p class="pt-4 ps-4 ps-xl-0 small">Anteil an globalen CO₂-Emissionen<br><span class="fw-bold">nach Unternehmen</span></p>
                    </div>
                    <div class="col-md-6 col-lg-12 col-xl-3 offset-xl-2 text-md-center text-lg-start text-xl-center d-flex flex-md-column flex-lg-row flex-xl-column align-items-center">
                        <div class="emissionen-container"><canvas id="countryChart"></canvas></div>
                        <p class="pt-4 ps-4 ps-xl-0 small">Anteil an globalen CO₂-Emissionen<br><span class="fw-bold">nach Land</span></p>
                    </div>
                </div>   
            </div> 
        </div>   
        <div class="row">
            <div class="col-xl-10 offset-xl-1">
                <div class="row mb-3 align-items-center pt-5">  
                    <!-- React-Suchleiste -->
                    <div class="col-lg-9 search-wrapper position-relative"></div>
                    <div class="col-md-5 col-lg-3 offset-lg-0 mt-3 mt-sm-0 d-sm-none d-lg-block">
                        <div class="dropdown">
                            <button 
                            class="btn btn-light dropdown-toggle w-100 text-start text-sm-center" 
                            type="button" 
                            id="sortDropdownButton" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">
                            Sortierung ändern
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="sortDropdownButton">
                            <li><button class="dropdown-item" data-key="country" data-dir="asc" type="button">Land aufsteigend</button></li>
                            <li><button class="dropdown-item" data-key="country" data-dir="desc" type="button">Land absteigend</button></li>
                            <li><button class="dropdown-item" data-key="company" data-dir="asc" type="button">Unternehmen aufsteigend</button></li>
                            <li><button class="dropdown-item" data-key="company" data-dir="desc" type="button">Unternehmen absteigend</button></li>
                            <li><button class="dropdown-item" data-key="emissions" data-dir="asc" type="button">CO₂-Emissionen aufsteigend</button></li>
                            <li><button class="dropdown-item" data-key="emissions" data-dir="desc" type="button">CO₂-Emissionen absteigend</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- React-Tabelle -->
<section class="bg-primary bg-opacity-25">
    <div class="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5 py-3 py-md-4">
        <div class="container-fluid">
            <div class="row pt-4">
                <div class="col-xl-10 offset-xl-1">
                    <div id="table" class="table-responsive"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="hero-banner hero-support d-flex align-items-center">
    <div class="c-banner d-block z-1 position-absolute top-0 bottom-0 start-0 end-0"></div>
    <div class="bg-banner position-absolute top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 z-2 z-lg-0"></div>
    <div class="container-fluid text-white position-relative z-2">
        <div class="m-1 m-sm-2 m-md-3 mx-lg-4 px-xl-5">
            <div class="row">
                <div class="col-lg-7 offset-lg-4 col-md-9">
                    <h2 class="display-3 fw-bold">Wir wollen eine Symbiose mit der Natur</h2>
                    <p class="lead mb-4">Wir wollen die globalen Ressourcen nutzen und nicht ausnutzen: mit einer funktionierenden Kreislaufwirtschaft.</p>
                    <a href="{{ site.baseurl }}/ueber-uns" class="btn btn-dark btn-lg">Unterstütze uns dabei</a>
                </div>
            </div>
        </div>
    </div>
</section>