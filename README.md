# EarthCircle
Mein erstes GIT-Repository für den Kurs: IPWA01-01 – Programmierung von Webanwendungsoberflächen

## Inhaltsverzeichnis
- [Grundgedanken](#grundgedanken)
- [Aufbau](#aufbau)
- [Aufgabenstellung](#aufgabenstellung)
- [Antworten](#antworten)
- [Copyright](#copyright)

## Grundgedanken
Ich hab den Kurs genutzt, um meine bisherige Berufserfahrung zu erweitern und GIT zu verstehen und zu testen. Die eingesetzen Frameworks und Schriften sind für den Projektumfang überdimensioniert bzw. hätten auf relevante Bereiche reduziert werden können. Ich hab mich dafür entschieden Schriften, Icons und verschiedene Frameworks zu nutzen, damit das Projekt praxisnah aufgebaut und strukturiert ist.

- Babel (JSX kompilieren)

- React (JS)
- Bootstrap (CSS + JS)
- Chart (JS)
- Swiper (JS)
- Montserrat (Schriftdateien + CSS)
- Phosphor (Schriftdateien + CSS)

## Aufbau

Alle Frameworks sind innerhalb des Projekts integriert, damit das Projekt dsgvo-konform ist. Es werden also weder Schriften noch Frameworks von externen Servern geladen.

Verwendete Frameworks und Bibliotheken:

```text
main/
|- libs/
```

Die Tabelle mit den Emissionsdaten wird über React geladen und aktualisiert. Statische Elemente, wie beispielsweise das Menü oder auch das Input-Feld für die Suche, sind direkt in der HTML-Datei. Die Emissionsdaten werden über eine JSON-Datei integriert, so dass simuliert wird, dass die Seite externe Datensätze verarbeitet.

Ich hab außerdem Chart.js für die Diagramme und Swiper.js für den Slider verwendet, da beides nicht über Bootstrap gelöst werden kann. Die Seite ist fast komplett mit Bootstrap strukturiert und gestaltet, um möglichst wenig eigenes, zusätzliches CSS zu erzeugen.

Eigene Inhalte sind unter:

```text
main/
|- _pages/
|- _posts/
|- _includes/
|- _layouts/
|- assets/
```

Die Seite wurde mit Jekyll umgesetzt, einem statischen Site-Generator, der es ermöglicht, Webseiten aus Markdown-Dateien und Vorlagen (Templates) zu erzeugen. Dadurch bleibt der Code sauber, modular und gut strukturiert. In einer „echten“ Anwendung würde man wahrscheinlich noch eine Datenbank für die Inhalte anschließen oder die Seite als WordPress-Template aufbauen. Für dieses Testprojekt war die Jekyll-Lösung jedoch die einfachste und praktikabelste Variante.

## Aufgabenstellung

In einem interdisziplinären Team entwickelst Du professionelle Webseiten für eine große Non-Profit- Organisation, die sich mit dem Klimawandel beschäftigt. Um mehr Transparenz darüber zu schaffen, welche Unternehmen und Länder wie viel CO2 jährlich emittieren, soll eine öffentlich zugängliche Webseite ins Leben gerufen werden. Deine Aufgabe ist es, diese Seite zu entwerfen und umzusetzen.

a) Richte ein öffentliches Code-Repository für Deine Webseite ein, z. B. in GitHub.

b) Entwickle unter Zuhilfenahme moderner CSS- und/oder JavaScript-Frameworks eine Webanwendung, welche unter Berücksichtigung der oben beschriebenen Fallstudie die folgenden Anforderungen erfüllt:

- Die Webseite besitzt einen Titel und ein Logo.
- Die Webseite verfügt über einen Header mit einer globalen Navigation, einen Content-Bereich und einen Footer mit rechtlichen Hinweisen.
- Die Webseite besitzt ein Menü mit lokalen Links, das je nach Schriftkultur der Besuchenden rechts oder links dargestellt wird.
- Die Seite soll responsiv sein, sodass sie nicht nur mit einem breiten Desktop-Monitor, sondern auch auf Tablets oder Smartphones gut lesbar dargestellt wird.
- Die Seite soll eine Tabelle mit (fiktiven) CO2-Emissionsdaten enthalten, die nach Land und Unternehmen sortiert und gefiltert werden kann.
- Alle Eingabefelder müssen so abgesichert sein, dass kein injizierter Code ausgeführt werden kann.

c) Dokumentiere Dein Ergebnis schriftlich und lege den Code, falls nicht bereits im Schritt 2 geschehen, im Code-Repository ab.

## Antworten

Die vollständige Dokumentation in der sowohl der Codeaufbau als auch die Wahl der Frameworks begründet wird, ist über die Prüfungsplattform eingereicht. Im Folgenden ein Überblick wie die Anforderungen erfüllt wurden:

1. Titel: EarthCircle // Slogan: Für einen geschlossenen Kreislauf der Natur
2. ```<header>```, ```<nav>```, ```<main>```, ```<footer>``` gliedern die Seite. Die Navigation ist ein Teil des Headers. Ich hab mich für dieses Beispiel für einen One Pager und dementsprechend ein Menü mit Ankern entschieden, damit die Links nicht ins Leere laufen.
3. Das Menü navigiert mit Ankern an die entsprechenden Stellen. Mit der Pseudoklasse :dir(rtl), die von modernen Browsern unterstützt wird, wird die Ausrichtung des Headers sowie der Inhalte entsprechend angepasst.
4. Die Seite wird durch Bootstrap und das zusätliche Stylesheet (css/style.css) für unterschiedliche Bildschirmbreiten passend dargestellt.
5. Die Daten werden über eine JSON-Datei mit React geladen, sowie sortier- und durchsuchbar. Damit soll simuliert werden, dass der Datensatz von einem anderen Urheber stammt oder aus einem anderen System integriert wird.
6. Das Kontaktformular am Seitenende beinhaltet eine entsprechende Prüfung

## Copyright

Bitte beachten: Das Projekt kann weiterverwendet werden, aber die Gestaltung und der Code ist geistiges Eigentum von Andreas Wundersee und im Rahmen dieses Projekts erarbeitet worden.